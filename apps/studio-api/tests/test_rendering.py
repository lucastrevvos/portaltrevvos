import asyncio
from pathlib import Path
from types import SimpleNamespace

import pytest

from app.core.config import get_settings
from app.modules.rendering.html_templates import render_html
from app.modules.rendering.service import HtmlCssRenderer


def build_context() -> dict[str, object]:
    return {
        "width": 1080,
        "height": 1080,
        "slide_number": 1,
        "total_slides": 5,
        "title": "Proteina vegetal",
        "body": "Voce esta planejando ou so tentando bater meta?",
        "cta": "Fale com a equipe",
        "visual_notes": "Capa limpa com tipografia forte.",
        "brand_name": "Lais Smeha",
        "brand_logo_url": None,
        "brand_visual_style": "Editorial clean com ritmo e contraste.",
        "template_name": "Tecnico Editorial",
        "layout_rules": "Fundo claro com tipografia forte e hierarquia limpa.",
        "slide_label": "1/5",
        "background": "#F7F2EA",
        "primary": "#506044",
        "secondary": "#E7DDCF",
        "accent": "#B5895A",
        "title_font": "Georgia",
        "body_font": "Arial",
    }


def test_render_html_contains_title_and_body() -> None:
    html = render_html(build_context())

    assert "Proteina vegetal" in html
    assert "Voce esta planejando ou so tentando bater meta?" in html
    assert 'data-slide-number="1"' in html
    assert 'data-total-slides="5"' in html
    assert 'data-tenant="Lais Smeha"' in html


def test_renderer_writes_debug_html_and_rendered_png(tmp_path: Path) -> None:
    settings = get_settings()
    original_generated_dir = settings.generated_assets_dir
    settings.generated_assets_dir = str(tmp_path / "generated" / "studio")

    spec = SimpleNamespace(
        slide_number=1,
        total_slides=5,
        width=1080,
        height=1080,
        title="Proteina vegetal",
        body="Voce esta planejando ou so tentando bater meta?",
        cta="Fale com a equipe",
        visual_notes="Capa limpa com tipografia forte.",
        brand_logo_url=None,
        brand_visual_style="Editorial clean com ritmo e contraste.",
        brand_primary_color="#0F172A",
        brand_secondary_color="#F3EDE2",
        brand_accent_color="#C75C2A",
    )
    template = SimpleNamespace(
        name="Tecnico Editorial",
        layout_rules="Fundo claro com tipografia forte e hierarquia limpa.",
        css_theme={
            "background": "#F7F2EA",
            "primary": "#506044",
            "secondary": "#E7DDCF",
            "accent": "#B5895A",
            "titleFont": "Georgia",
            "bodyFont": "Arial",
        },
    )

    try:
        renderer = HtmlCssRenderer()
        output_path, _ = asyncio.run(
            renderer.render(
                tenant_slug="lais-smeha",
                tenant_name="Lais Smeha",
                request_slug="proteina-vegetal",
                request_id="request-debug",
                spec=spec,
                template=template,
            )
        )
    finally:
        settings.generated_assets_dir = original_generated_dir

    debug_html_path = (
        tmp_path
        / "generated"
        / "studio"
        / "lais-smeha"
        / "request-debug"
        / "debug-slide-01.html"
    )
    debug_log_path = debug_html_path.with_suffix(".txt")

    assert output_path.exists()
    assert output_path.stat().st_size > 10_000
    assert debug_html_path.exists()
    assert debug_log_path.exists()
    assert "Proteina vegetal" in debug_html_path.read_text(encoding="utf-8")
    assert (
        "Voce esta planejando ou so tentando bater meta?"
        in debug_html_path.read_text(encoding="utf-8")
    )
    debug_log = debug_log_path.read_text(encoding="utf-8")
    assert "playwright_attempted=true" in debug_log
    assert "playwright_success=true" in debug_log
    assert "rendered=true" in debug_log
    assert "fallback_used=false" in debug_log
    assert "title_present=true" in debug_log
    assert "body_present=true" in debug_log


def test_renderer_raises_and_logs_real_reason_when_playwright_fails_in_development(
    tmp_path: Path,
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    settings = get_settings()
    original_generated_dir = settings.generated_assets_dir
    settings.generated_assets_dir = str(tmp_path / "generated" / "studio")

    spec = SimpleNamespace(
        slide_number=1,
        total_slides=5,
        width=1080,
        height=1080,
        title="Proteina vegetal",
        body="Voce esta planejando ou so tentando bater meta?",
        cta="Fale com a equipe",
        visual_notes="Capa limpa com tipografia forte.",
        brand_logo_url=None,
        brand_visual_style="Editorial clean com ritmo e contraste.",
        brand_primary_color="#0F172A",
        brand_secondary_color="#F3EDE2",
        brand_accent_color="#C75C2A",
    )
    template = SimpleNamespace(
        name="Tecnico Editorial",
        layout_rules="Fundo claro com tipografia forte e hierarquia limpa.",
        css_theme={
            "background": "#F7F2EA",
            "primary": "#506044",
            "secondary": "#E7DDCF",
            "accent": "#B5895A",
            "titleFont": "Georgia",
            "bodyFont": "Arial",
        },
    )

    def fail_render(
        html: str,
        output_path: Path,
        width: int,
        height: int,
    ) -> None:
        raise RuntimeError("browser launch failed")

    try:
        renderer = HtmlCssRenderer()
        monkeypatch.setattr(renderer, "_render_with_playwright_sync", fail_render)
        with pytest.raises(RuntimeError, match="fallback disabled"):
            asyncio.run(
                renderer.render(
                    tenant_slug="lais-smeha",
                    tenant_name="Lais Smeha",
                    request_slug="proteina-vegetal",
                    request_id="request-debug-fail",
                    spec=spec,
                    template=template,
                )
            )
    finally:
        settings.generated_assets_dir = original_generated_dir

    debug_log_path = (
        tmp_path
        / "generated"
        / "studio"
        / "lais-smeha"
        / "request-debug-fail"
        / "debug-slide-01.txt"
    )
    output_path = (
        tmp_path
        / "generated"
        / "studio"
        / "lais-smeha"
        / "request-debug-fail"
        / "lais-smeha-proteina-vegetal-slide-01.png"
    )

    assert debug_log_path.exists()
    assert not output_path.exists()
    debug_log = debug_log_path.read_text(encoding="utf-8")
    assert "renderer=html_playwright" in debug_log
    assert "playwright_attempted=true" in debug_log
    assert "playwright_success=false" in debug_log
    assert "fallback_used=false" in debug_log
    assert (
        "fallback_reason=RuntimeError: RuntimeError('browser launch failed')"
        in debug_log
    )
    assert "failure_traceback_start" in debug_log
