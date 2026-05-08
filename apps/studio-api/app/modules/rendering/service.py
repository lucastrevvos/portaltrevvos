from __future__ import annotations

import asyncio
import base64
import binascii
import logging
import mimetypes
import struct
import traceback
import zlib
from pathlib import Path
from typing import Any

from playwright.sync_api import sync_playwright

from app.core.config import get_settings
from app.modules.render_specs.models import RenderSpec
from app.modules.rendering.html_templates import render_html
from app.modules.visual_templates.models import VisualTemplate

logger = logging.getLogger(__name__)


class HtmlCssRenderer:
    def __init__(self) -> None:
        self.settings = get_settings()
        self.project_root = Path(__file__).resolve().parents[3]
        generated_base = Path(self.settings.generated_assets_dir)
        uploads_base = Path(self.settings.uploads_dir)
        self.generated_root = (
            generated_base
            if generated_base.is_absolute()
            else self.project_root / generated_base
        )
        self.uploads_root = (
            uploads_base
            if uploads_base.is_absolute()
            else self.project_root / uploads_base
        )
        self.raise_on_playwright_failure = self.settings.env in {
            "development",
            "test",
            "testing",
        }

    async def render(
        self,
        *,
        tenant_slug: str,
        tenant_name: str,
        request_slug: str,
        request_id: str,
        spec: RenderSpec,
        template: VisualTemplate,
        background_asset_url: str | None = None,
        logo_asset_url: str | None = None,
        render_mode: str = "simple",
    ) -> tuple[Path, str]:
        output_dir = self.generated_root / tenant_slug / request_id
        output_dir.mkdir(parents=True, exist_ok=True)

        file_name = self._build_file_name(tenant_slug, request_slug, spec)
        output_path = output_dir / file_name
        public_url = f"/generated/studio/{tenant_slug}/{request_id}/{file_name}"
        context = self._build_context(
            tenant_name,
            spec,
            template,
            background_asset_url=background_asset_url,
            logo_asset_url=logo_asset_url,
            render_mode=render_mode,
        )
        html = render_html(context)
        debug_html_path = output_dir / self._build_debug_html_name(spec)
        debug_log_path = output_dir / self._build_debug_log_name(spec)
        self._write_debug_html(debug_html_path, html)
        self._write_debug_log(
            debug_log_path,
            html=html,
            context=context,
            spec=spec,
            renderer="html_playwright",
            playwright_attempted=True,
            playwright_success=False,
            rendered=False,
            fallback_used=False,
            fallback_reason=None,
            failure_traceback=None,
        )
        try:
            await self._render_with_playwright(
                html=html,
                output_path=output_path,
                width=spec.width,
                height=spec.height,
            )
            self._write_debug_log(
                debug_log_path,
                html=html,
                context=context,
                spec=spec,
                renderer="html_playwright",
                playwright_attempted=True,
                playwright_success=True,
                rendered=True,
                fallback_used=False,
                fallback_reason=None,
                failure_traceback=None,
            )
        except Exception as exc:
            fallback_reason = f"{type(exc).__name__}: {exc!r}"
            failure_traceback = traceback.format_exc()
            logger.exception(
                (
                    "Studio renderer Playwright failure for tenant=%s "
                    "request_id=%s slide=%s"
                ),
                tenant_slug,
                request_id,
                spec.slide_number,
            )
            self._write_debug_log(
                debug_log_path,
                html=html,
                context=context,
                spec=spec,
                renderer="html_playwright",
                playwright_attempted=True,
                playwright_success=False,
                rendered=False,
                fallback_used=not self.raise_on_playwright_failure,
                fallback_reason=fallback_reason,
                failure_traceback=failure_traceback,
            )
            if self.raise_on_playwright_failure:
                raise RuntimeError(
                    "Playwright rendering failed; fallback disabled in "
                    f"{self.settings.env} environment."
                ) from exc

            self._render_fallback_png(
                output_path,
                spec.width,
                spec.height,
                template.css_theme,
            )
            self._write_debug_log(
                debug_log_path,
                html=html,
                context=context,
                spec=spec,
                renderer="fallback_png",
                playwright_attempted=True,
                playwright_success=False,
                rendered=False,
                fallback_used=True,
                fallback_reason=fallback_reason,
                failure_traceback=failure_traceback,
            )

        return output_path, public_url

    def _build_file_name(
        self,
        tenant_slug: str,
        request_slug: str,
        spec: RenderSpec,
    ) -> str:
        if spec.slide_number is not None:
            return f"{tenant_slug}-{request_slug}-slide-{spec.slide_number:02d}.png"
        return f"{tenant_slug}-{request_slug}-post.png"

    def _build_context(
        self,
        tenant_name: str,
        spec: RenderSpec,
        template: VisualTemplate,
        *,
        background_asset_url: str | None = None,
        logo_asset_url: str | None = None,
        render_mode: str = "simple",
    ) -> dict[str, object]:
        theme = template.css_theme or {}
        slide_label = "Post"
        if spec.slide_number is not None and spec.total_slides is not None:
            slide_label = f"{spec.slide_number}/{spec.total_slides}"

        return {
            "width": spec.width,
            "height": spec.height,
            "slide_number": spec.slide_number,
            "total_slides": spec.total_slides,
            "title": spec.title,
            "body": spec.body,
            "cta": spec.cta,
            "visual_notes": spec.visual_notes,
            "brand_name": tenant_name,
            "brand_logo_url": self._resolve_asset_url(
                logo_asset_url or spec.brand_logo_url
            ),
            "background_asset_url": self._resolve_asset_url(background_asset_url),
            "brand_visual_style": spec.brand_visual_style,
            "template_name": template.name,
            "layout_rules": template.layout_rules,
            "slide_label": slide_label,
            "render_mode": render_mode,
            "background": theme.get(
                "background",
                spec.brand_secondary_color or "#F7F2EA",
            ),
            "primary": theme.get("primary", spec.brand_primary_color or "#506044"),
            "secondary": theme.get(
                "secondary",
                spec.brand_secondary_color or "#E7DDCF",
            ),
            "accent": theme.get("accent", spec.brand_accent_color or "#B5895A"),
            "title_font": theme.get("titleFont", "Georgia"),
            "body_font": theme.get("bodyFont", "Arial"),
        }

    def _resolve_asset_url(self, value: str | None) -> str | None:
        if not value:
            return None
        if value.startswith("http://") or value.startswith("https://"):
            return value
        if value.startswith("/"):
            relative = Path(value.lstrip("/"))
            candidates = []
            if relative.parts and relative.parts[0] == "uploads":
                candidates.append(self.uploads_root / Path(*relative.parts[1:]))
            if relative.parts and relative.parts[0] == "generated":
                candidates.append(self.generated_root / Path(*relative.parts[1:]))
            candidates.append(self.project_root / relative)
            for local_path in candidates:
                if local_path.exists():
                    mime_type = mimetypes.guess_type(local_path.name)[0] or "image/png"
                    encoded = base64.b64encode(local_path.read_bytes()).decode("ascii")
                    return f"data:{mime_type};base64,{encoded}"
        return value

    def _build_debug_html_name(self, spec: RenderSpec) -> str:
        if spec.slide_number is not None:
            return f"debug-slide-{spec.slide_number:02d}.html"
        return "debug-post.html"

    def _build_debug_log_name(self, spec: RenderSpec) -> str:
        if spec.slide_number is not None:
            return f"debug-slide-{spec.slide_number:02d}.txt"
        return "debug-post.txt"

    def _write_debug_html(self, debug_html_path: Path, html: str) -> None:
        debug_html_path.write_text(html, encoding="utf-8")

    def _write_debug_log(
        self,
        debug_log_path: Path,
        *,
        html: str,
        context: dict[str, object],
        spec: RenderSpec,
        renderer: str,
        playwright_attempted: bool,
        playwright_success: bool,
        rendered: bool,
        fallback_used: bool,
        fallback_reason: str | None,
        failure_traceback: str | None,
    ) -> None:
        title = str(context.get("title") or "")
        body = str(context.get("body") or "")
        slide_number = context.get("slide_number", spec.slide_number)
        total_slides = context.get("total_slides", spec.total_slides)
        lines = [
            f"renderer={renderer}",
            f"playwright_attempted={str(playwright_attempted).lower()}",
            f"playwright_success={str(playwright_success).lower()}",
            f"rendered={str(rendered).lower()}",
            f"fallback_used={str(fallback_used).lower()}",
            f"fallback_reason={fallback_reason or ''}",
            f"slide_number={slide_number if slide_number is not None else ''}",
            f"total_slides={total_slides if total_slides is not None else ''}",
            f"title_present={str(title in html).lower()}",
            f"body_present={str((not body) or (body in html)).lower()}",
            f"title={title}",
            f"body={body}",
            f"tenant={context.get('brand_name') or ''}",
            f"template={context.get('template_name') or ''}",
            f"background={context.get('background') or ''}",
            f"primary={context.get('primary') or ''}",
            f"secondary={context.get('secondary') or ''}",
            f"accent={context.get('accent') or ''}",
            f"html_length={len(html)}",
        ]
        if failure_traceback:
            lines.append("failure_traceback_start")
            lines.extend(failure_traceback.rstrip().splitlines())
            lines.append("failure_traceback_end")
        debug_log_path.write_text("\n".join(lines) + "\n", encoding="utf-8")

    async def _render_with_playwright(
        self,
        *,
        html: str,
        output_path: Path,
        width: int,
        height: int,
    ) -> None:
        if not html.strip():
            raise ValueError("Rendered HTML is empty.")
        await asyncio.to_thread(
            self._render_with_playwright_sync,
            html,
            output_path,
            width,
            height,
        )

    def _render_with_playwright_sync(
        self,
        html: str,
        output_path: Path,
        width: int,
        height: int,
    ) -> None:
        with sync_playwright() as playwright:
            browser = playwright.chromium.launch()
            try:
                page = browser.new_page(
                    viewport={"width": width, "height": height},
                    device_scale_factor=1,
                )
                page.set_content(html, wait_until="domcontentloaded")
                page.wait_for_selector(".frame")
                page.wait_for_function(
                    "() => document.body && document.body.innerText.trim().length > 0"
                )
                title_text = page.locator(".title").text_content()
                body_locator = page.locator(".body")
                body_text = (
                    body_locator.text_content() if body_locator.count() > 0 else None
                )
                if not title_text or not title_text.strip():
                    raise ValueError("Rendered HTML is missing slide title text.")
                if 'class="body"' in html and (not body_text or not body_text.strip()):
                    raise ValueError("Rendered HTML is missing slide body text.")
                page.screenshot(path=str(output_path), type="png")
            finally:
                browser.close()

    def _render_fallback_png(
        self,
        output_path: Path,
        width: int,
        height: int,
        theme: dict[str, Any],
    ) -> None:
        color = self._hex_to_rgb(theme.get("background", "#F7F2EA"))
        output_path.write_bytes(self._generate_solid_png(width, height, color))

    def _hex_to_rgb(self, value: str) -> tuple[int, int, int]:
        cleaned = value.lstrip("#")
        if len(cleaned) == 3:
            cleaned = "".join(part * 2 for part in cleaned)
        if len(cleaned) != 6:
            return (247, 242, 234)
        return tuple(int(cleaned[index : index + 2], 16) for index in range(0, 6, 2))

    def _generate_solid_png(
        self,
        width: int,
        height: int,
        color: tuple[int, int, int],
    ) -> bytes:
        row = b"\x00" + bytes(color) * width
        raw = row * height
        compressed = zlib.compress(raw, level=9)

        def chunk(chunk_type: bytes, data: bytes) -> bytes:
            return (
                struct.pack("!I", len(data))
                + chunk_type
                + data
                + struct.pack("!I", binascii.crc32(chunk_type + data) & 0xFFFFFFFF)
            )

        header = struct.pack("!IIBBBBB", width, height, 8, 2, 0, 0, 0)
        return b"".join(
            [
                b"\x89PNG\r\n\x1a\n",
                chunk(b"IHDR", header),
                chunk(b"IDAT", compressed),
                chunk(b"IEND", b""),
            ]
        )
