from __future__ import annotations

import base64
from io import BytesIO
from pathlib import Path
from typing import Any, Protocol
from uuid import UUID

from PIL import Image
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import Settings, get_settings
from app.modules.ai_visual.prompts import build_background_prompt
from app.modules.ai_visual.schemas import (
    GeneratedVisualBackgroundResponseItem,
    GenerateVisualBackgroundsPayload,
    GenerateVisualBackgroundsResponse,
)
from app.modules.brand_assets.service import BrandAssetService
from app.modules.content_drafts.models import ContentDraft
from app.modules.content_requests.models import ContentRequest
from app.modules.content_requests.service import ContentRequestService
from app.modules.onboarding.models import OnboardingProfile
from app.modules.render_specs.models import CreativeAsset, RenderSpec
from app.modules.render_specs.service import RenderSpecService
from app.modules.tenants.models import Tenant
from app.modules.tenants.service import TenantService
from app.shared.enums import (
    BrandAssetType,
    ContentRequestStatus,
    CreativeAssetStatus,
    CreativeAssetType,
    RenderSpecStatus,
)
from app.shared.errors import BadRequestError, ConflictError, ServiceUnavailableError
from app.shared.storage import build_public_url, build_safe_file_name
from app.shared.text import slugify

try:
    from openai import AsyncOpenAI
except ImportError:  # pragma: no cover
    AsyncOpenAI = None


class AIVisualProvider(Protocol):
    async def generate_background(self, *, prompt: str) -> bytes: ...


class OpenAIVisualProvider:
    def __init__(self, settings: Settings) -> None:
        if not settings.enable_ai_visual:
            raise ServiceUnavailableError("AI visual generation is disabled.")
        if not settings.openai_api_key:
            raise ServiceUnavailableError(
                "STUDIO_OPENAI_API_KEY is not configured for AI visual generation."
            )
        if AsyncOpenAI is None:
            raise ServiceUnavailableError(
                "OpenAI SDK is not installed. Run `uv sync` in apps/studio-api."
            )
        self.settings = settings
        self.client = AsyncOpenAI(api_key=settings.openai_api_key)

    async def generate_background(self, *, prompt: str) -> bytes:
        response = await self.client.images.generate(
            model=self.settings.image_model,
            prompt=prompt,
            size="1024x1024",
        )
        data = response.data[0]
        if getattr(data, "b64_json", None):
            return base64.b64decode(data.b64_json)
        if getattr(data, "url", None):
            raise ServiceUnavailableError(
                "OpenAI returned a URL payload for image generation; "
                "this MVP expects base64 output."
            )
        raise ServiceUnavailableError(
            "OpenAI returned an empty image generation payload."
        )


def get_ai_visual_provider(settings: Settings | None = None) -> AIVisualProvider:
    return OpenAIVisualProvider(settings or get_settings())


class AIVisualService:
    def __init__(
        self,
        session: AsyncSession,
        *,
        provider: AIVisualProvider | None = None,
        settings: Settings | None = None,
    ) -> None:
        self.session = session
        self.settings = settings or get_settings()
        self.provider = provider
        self.tenant_service = TenantService(session)
        self.content_request_service = ContentRequestService(session)
        self.brand_asset_service = BrandAssetService(session)
        self.render_spec_service = RenderSpecService(session)
        self.project_root = Path(__file__).resolve().parents[3]
        uploads_base = Path(self.settings.uploads_dir)
        self.upload_root = (
            uploads_base
            if uploads_base.is_absolute()
            else self.project_root / uploads_base
        )

    async def generate_backgrounds(
        self,
        tenant_id: UUID,
        request_id: UUID,
        payload: GenerateVisualBackgroundsPayload,
    ) -> GenerateVisualBackgroundsResponse:
        tenant = await self.tenant_service.get_or_404(tenant_id)
        content_request = await self.render_spec_service._get_request_with_related(  # noqa: SLF001
            tenant_id,
            request_id,
        )
        if content_request.status != ContentRequestStatus.VISUAL_PROMPT_READY:
            raise BadRequestError(
                "AI visual backgrounds can only be generated after render specs "
                "are ready."
            )

        draft = content_request.draft
        if draft is None:
            raise BadRequestError("Content draft not found.")
        onboarding = content_request.tenant.onboarding_profile
        if onboarding is None:
            raise BadRequestError(
                "Onboarding profile is required before generating visual backgrounds."
            )
        ready_specs = await self.render_spec_service._list_specs(  # noqa: SLF001
            tenant_id,
            request_id,
            statuses=[RenderSpecStatus.READY],
        )
        if not ready_specs:
            raise BadRequestError("No ready render specs found for this request.")

        selected_specs = (
            [spec for spec in ready_specs if spec.slide_number in payload.slides]
            if payload.slides
            else ready_specs
        )
        if not selected_specs:
            raise BadRequestError("No matching slides found for background generation.")

        provider = self.provider or get_ai_visual_provider(self.settings)
        brand_assets = await self.brand_asset_service.list_for_tenant(tenant_id)
        brand_context = [
            {
                "type": asset.asset_type.value,
                "label": asset.label,
                "public_url": asset.public_url,
            }
            for asset in brand_assets
            if asset.asset_type != BrandAssetType.LOGO
        ]

        if payload.overwrite:
            await self._delete_existing_backgrounds(
                tenant_id,
                request_id,
                selected_specs,
            )
        else:
            existing = await self._list_backgrounds_for_specs(
                tenant_id,
                request_id,
                selected_specs,
            )
            if existing:
                raise ConflictError(
                    "Visual backgrounds already exist for some requested slides. "
                    "Use overwrite=true to regenerate."
                )

        generated_items: list[GeneratedVisualBackgroundResponseItem] = []
        for spec in selected_specs:
            prompt = build_background_prompt(
                tenant_context=self._build_tenant_context(tenant, onboarding),
                request_context=self._build_request_context(content_request),
                draft_context=self._build_draft_context(draft),
                slide_context=self._build_slide_context(spec),
                brand_assets=brand_context,
                style_mode=payload.style_mode,
            )
            image_bytes = await provider.generate_background(prompt=prompt)
            width, height = self._read_image_size(image_bytes)
            storage_path = self._build_background_storage_path(
                tenant_slug=tenant.slug,
                request_slug=slugify(content_request.theme or content_request.title),
                slide_number=spec.slide_number or 1,
            )
            storage_path.parent.mkdir(parents=True, exist_ok=True)
            storage_path.write_bytes(image_bytes)
            storage_record = self._build_background_storage_record(
                tenant_slug=tenant.slug,
                request_slug=slugify(content_request.theme or content_request.title),
                file_name=storage_path.name,
            )
            public_url = build_public_url(
                storage_record
            )
            asset = CreativeAsset(
                tenant_id=tenant_id,
                content_request_id=request_id,
                render_spec_id=spec.id,
                image_render_job_id=None,
                asset_type=CreativeAssetType.GENERATED_BACKGROUND,
                url=public_url,
                file_name=storage_path.name,
                mime_type="image/png",
                width=width,
                height=height,
                status=CreativeAssetStatus.READY_FOR_REVIEW,
            )
            self.session.add(asset)
            await self.session.flush()
            generated_items.append(
                GeneratedVisualBackgroundResponseItem(
                    slide_number=spec.slide_number or 1,
                    asset_id=asset.id,
                    public_url=public_url,
                )
            )

        await self.session.commit()
        return GenerateVisualBackgroundsResponse(
            content_request_id=request_id,
            generated_backgrounds=generated_items,
        )

    async def list_backgrounds(
        self,
        tenant_id: UUID,
        request_id: UUID,
    ) -> list[CreativeAsset]:
        await self.content_request_service.get_or_404(tenant_id, request_id)
        result = await self.session.execute(
            select(CreativeAsset)
            .where(
                CreativeAsset.tenant_id == tenant_id,
                CreativeAsset.content_request_id == request_id,
                CreativeAsset.asset_type == CreativeAssetType.GENERATED_BACKGROUND,
            )
            .order_by(CreativeAsset.created_at.asc(), CreativeAsset.id.asc())
        )
        return list(result.scalars().all())

    async def _delete_existing_backgrounds(
        self,
        tenant_id: UUID,
        request_id: UUID,
        specs: list[RenderSpec],
    ) -> None:
        backgrounds = await self._list_backgrounds_for_specs(
            tenant_id,
            request_id,
            specs,
        )
        for asset in backgrounds:
            storage_path = self._resolve_storage_path(asset.storage_path)
            if storage_path.exists():
                storage_path.unlink()
            await self.session.delete(asset)
        await self.session.flush()

    async def _list_backgrounds_for_specs(
        self,
        tenant_id: UUID,
        request_id: UUID,
        specs: list[RenderSpec],
    ) -> list[CreativeAsset]:
        spec_ids = [spec.id for spec in specs]
        if not spec_ids:
            return []
        result = await self.session.execute(
            select(CreativeAsset)
            .where(
                CreativeAsset.tenant_id == tenant_id,
                CreativeAsset.content_request_id == request_id,
                CreativeAsset.asset_type == CreativeAssetType.GENERATED_BACKGROUND,
                CreativeAsset.render_spec_id.in_(spec_ids),
            )
            .order_by(CreativeAsset.created_at.asc(), CreativeAsset.id.asc())
        )
        return list(result.scalars().all())

    def _build_tenant_context(
        self,
        tenant: Tenant,
        onboarding: OnboardingProfile,
    ) -> dict[str, Any]:
        return {
            "tenant": {
                "name": tenant.name,
                "business_name": tenant.business_name,
                "niche": tenant.niche,
            },
            "onboarding": {
                "professional_name": onboarding.professional_name,
                "target_audience": onboarding.target_audience,
                "audience_pain_points": onboarding.audience_pain_points,
                "main_services": onboarding.main_services,
                "desired_positioning": onboarding.desired_positioning,
                "tone_of_voice": onboarding.tone_of_voice,
            },
        }

    def _build_request_context(self, content_request: ContentRequest) -> dict[str, Any]:
        return {
            "content_request": {
                "title": content_request.title,
                "format": content_request.format.value,
                "objective": content_request.objective.value,
                "cta": content_request.cta,
                "theme": content_request.theme,
                "briefing": content_request.briefing,
            }
        }

    def _build_draft_context(self, draft: ContentDraft) -> dict[str, Any]:
        return {
            "title": draft.title,
            "caption": draft.caption,
            "fixed_comment": draft.fixed_comment,
            "stories_suggestion": draft.stories_suggestion,
        }

    def _build_slide_context(self, spec: RenderSpec) -> dict[str, Any]:
        return {
            "slide_number": spec.slide_number,
            "total_slides": spec.total_slides,
            "title": spec.title,
            "body": spec.body,
            "visual_notes": spec.visual_notes,
            "brand_visual_style": spec.brand_visual_style,
        }

    def _build_background_storage_path(
        self,
        *,
        tenant_slug: str,
        request_slug: str,
        slide_number: int,
    ) -> Path:
        file_name = build_safe_file_name(
            f"{request_slug}-slide-{slide_number:02d}.png",
            fallback_stem=f"{request_slug}-slide-{slide_number:02d}",
            extension=".png",
        )
        return (
            self.upload_root
            / "ai-visual"
            / tenant_slug
            / request_slug
            / file_name
        )

    def _build_background_storage_record(
        self,
        *,
        tenant_slug: str,
        request_slug: str,
        file_name: str,
    ) -> str:
        return (
            Path("uploads")
            / "ai-visual"
            / tenant_slug
            / request_slug
            / file_name
        ).as_posix()

    def _resolve_storage_path(self, storage_path: str) -> Path:
        path = Path(storage_path)
        if path.is_absolute():
            return path
        if path.parts and path.parts[0] == "uploads":
            return self.upload_root / Path(*path.parts[1:])
        return self.project_root / path

    def _read_image_size(self, image_bytes: bytes) -> tuple[int | None, int | None]:
        try:
            with Image.open(BytesIO(image_bytes)) as image:
                return image.width, image.height
        except Exception:
            return None, None
