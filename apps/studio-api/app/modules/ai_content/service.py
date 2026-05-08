from __future__ import annotations

import json
from copy import deepcopy
from datetime import UTC, datetime
from typing import Any, Protocol
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.config import Settings, get_settings
from app.modules.ai_content.prompts import (
    build_draft_prompt,
    build_generation_system_prompt,
    build_ideas_prompt,
)
from app.modules.ai_content.quality import run_quality_check
from app.modules.ai_content.schemas import (
    AIDraftOutput,
    AIGenerateDraftPayload,
    AIGenerateDraftResponse,
    AIIdeasOutput,
    ContentIdeaRequest,
    ContentIdeaResponseItem,
    ContentIdeasResponse,
    DraftQualityCheckResponse,
)
from app.modules.brand_kits.service import BrandKitService
from app.modules.content_drafts.models import ApprovalEvent, CarouselSlide, ContentDraft
from app.modules.content_drafts.schemas import ContentDraftResponse
from app.modules.content_requests.models import ContentRequest
from app.modules.content_requests.service import ContentRequestService
from app.modules.onboarding.models import OnboardingProfile
from app.modules.onboarding.service import OnboardingService
from app.modules.tenants.models import Tenant
from app.modules.tenants.service import TenantService
from app.shared.enums import (
    ApprovalActorType,
    ApprovalEventType,
    ContentDraftStatus,
    ContentFormat,
    ContentRequestStatus,
)
from app.shared.errors import (
    BadRequestError,
    ConflictError,
    ServiceUnavailableError,
)

try:
    from openai import AsyncOpenAI
except ImportError:  # pragma: no cover - handled at runtime when the SDK is absent.
    AsyncOpenAI = None


TEXT_RESTARTABLE_REQUEST_STATUSES = {
    ContentRequestStatus.AWAITING_TEXT_APPROVAL,
    ContentRequestStatus.TEXT_REVISION_REQUESTED,
}


class AIContentProvider(Protocol):
    async def generate_content_ideas(
        self,
        *,
        tenant_context: dict[str, Any],
        request_context: dict[str, Any],
    ) -> AIIdeasOutput: ...

    async def generate_draft(
        self,
        *,
        tenant_context: dict[str, Any],
        request_context: dict[str, Any],
        slide_count: int,
        extra_instructions: str | None,
    ) -> AIDraftOutput: ...


class OpenAIContentProvider:
    def __init__(self, settings: Settings) -> None:
        if not settings.openai_api_key:
            raise ServiceUnavailableError(
                "STUDIO_OPENAI_API_KEY is not configured for the "
                "Studio AI content engine."
            )
        if AsyncOpenAI is None:
            raise ServiceUnavailableError(
                "OpenAI SDK is not installed. Run `uv sync` in apps/studio-api."
            )
        self.settings = settings
        self.client = AsyncOpenAI(api_key=settings.openai_api_key)

    async def generate_content_ideas(
        self,
        *,
        tenant_context: dict[str, Any],
        request_context: dict[str, Any],
    ) -> AIIdeasOutput:
        payload = await self._generate_structured_output(
            schema_model=AIIdeasOutput,
            schema_name="studio_content_ideas",
            prompt=build_ideas_prompt(
                tenant_context=tenant_context,
                request_context=request_context,
            ),
        )
        return AIIdeasOutput.model_validate(payload)

    async def generate_draft(
        self,
        *,
        tenant_context: dict[str, Any],
        request_context: dict[str, Any],
        slide_count: int,
        extra_instructions: str | None,
    ) -> AIDraftOutput:
        payload = await self._generate_structured_output(
            schema_model=AIDraftOutput,
            schema_name="studio_content_draft",
            prompt=build_draft_prompt(
                tenant_context=tenant_context,
                request_context=request_context,
                slide_count=slide_count,
                extra_instructions=extra_instructions,
            ),
        )
        return AIDraftOutput.model_validate(payload)

    async def _generate_structured_output(
        self,
        *,
        schema_model: type[AIDraftOutput] | type[AIIdeasOutput],
        schema_name: str,
        prompt: str,
    ) -> dict[str, Any]:
        response = await self.client.responses.create(
            model=self.settings.ai_model,
            input=[
                {
                    "role": "system",
                    "content": build_generation_system_prompt(),
                },
                {
                    "role": "user",
                    "content": prompt,
                },
            ],
            text={
                "format": {
                    "type": "json_schema",
                    "name": schema_name,
                    "strict": True,
                    "schema": build_openai_strict_json_schema(schema_model),
                }
            },
        )

        output_text = getattr(response, "output_text", None)
        if not output_text:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=(
                    "OpenAI returned an empty response for the "
                    "Studio AI content engine."
                ),
            )

        try:
            return json.loads(output_text)
        except json.JSONDecodeError as exc:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="OpenAI returned invalid JSON for the Studio AI content engine.",
            ) from exc


def get_ai_provider(settings: Settings | None = None) -> AIContentProvider:
    return OpenAIContentProvider(settings or get_settings())


def build_openai_strict_json_schema(
    schema_model: type[AIDraftOutput] | type[AIIdeasOutput],
) -> dict[str, Any]:
    schema = deepcopy(schema_model.model_json_schema())
    _normalize_schema_for_openai(schema)
    return schema


def _normalize_schema_for_openai(node: dict[str, Any]) -> None:
    if "$defs" in node:
        for definition in node["$defs"].values():
            if isinstance(definition, dict):
                _normalize_schema_for_openai(definition)

    properties = node.get("properties")
    if isinstance(properties, dict):
        node["required"] = list(properties.keys())
        node["additionalProperties"] = False
        for property_schema in properties.values():
            if isinstance(property_schema, dict):
                _normalize_schema_for_openai(property_schema)

    items = node.get("items")
    if isinstance(items, dict):
        _normalize_schema_for_openai(items)

    any_of = node.get("anyOf")
    if isinstance(any_of, list):
        for option in any_of:
            if isinstance(option, dict):
                _normalize_schema_for_openai(option)

    if "default" in node:
        node.pop("default")


class AIContentService:
    def __init__(
        self,
        session: AsyncSession,
        *,
        provider: AIContentProvider | None = None,
        settings: Settings | None = None,
    ) -> None:
        self.session = session
        self.settings = settings or get_settings()
        self.provider = provider
        self.tenant_service = TenantService(session)
        self.onboarding_service = OnboardingService(session)
        self.brand_kit_service = BrandKitService(session)
        self.content_request_service = ContentRequestService(session)

    async def generate_content_ideas(
        self,
        tenant_id: UUID,
        payload: ContentIdeaRequest,
    ) -> ContentIdeasResponse:
        tenant = await self.tenant_service.get_or_404(tenant_id)
        onboarding = await self._get_onboarding_or_raise(tenant_id)
        brand_kit = await self._get_brand_kit_optional(tenant_id)
        provider = self.provider or get_ai_provider(self.settings)

        tenant_context = self._build_tenant_context(tenant, onboarding, brand_kit)
        request_context = {
            "goal": payload.goal.value,
            "count": payload.count,
            "format": payload.format.value,
            "additional_context": payload.additional_context,
        }
        ideas_output = await provider.generate_content_ideas(
            tenant_context=tenant_context,
            request_context=request_context,
        )
        if len(ideas_output.ideas) < payload.count:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="OpenAI returned fewer ideas than requested.",
            )

        ideas = [
            ContentIdeaResponseItem(
                title=item.title.strip(),
                format=item.format,
                objective=item.objective,
                rationale=item.rationale.strip(),
                cta_suggestion=item.cta_suggestion.strip() or None,
            )
            for item in ideas_output.ideas[: payload.count]
        ]
        return ContentIdeasResponse(ideas=ideas)

    async def generate_draft(
        self,
        tenant_id: UUID,
        request_id: UUID,
        payload: AIGenerateDraftPayload,
    ) -> AIGenerateDraftResponse:
        tenant = await self.tenant_service.get_or_404(tenant_id)
        onboarding = await self._get_onboarding_or_raise(tenant_id)
        brand_kit = await self._get_brand_kit_optional(tenant_id)
        content_request = await self.content_request_service.get_or_404(
            tenant_id,
            request_id,
        )
        provider = self.provider or get_ai_provider(self.settings)
        existing_draft = await self._get_draft_for_request(tenant_id, request_id)

        if existing_draft is not None:
            if existing_draft.status == ContentDraftStatus.APPROVED:
                raise ConflictError(
                    "Draft aprovado nao pode ser sobrescrito nesta "
                    "versao. Versionamento sera implementado futuramente."
                )
            if not payload.overwrite:
                raise ConflictError(
                    "Ja existe um draft para este pedido. Use "
                    "overwrite=true para sobrescrever com IA."
                )

        tenant_context = self._build_tenant_context(tenant, onboarding, brand_kit)
        request_context = self._build_request_context(content_request)
        generated = await provider.generate_draft(
            tenant_context=tenant_context,
            request_context=request_context,
            slide_count=payload.slide_count,
            extra_instructions=payload.extra_instructions,
        )

        self._validate_generated_draft(
            generated,
            content_request=content_request,
            slide_count=payload.slide_count,
        )
        quality_check = run_quality_check(
            niche=tenant.niche,
            draft=generated,
            main_cta=content_request.cta or onboarding.main_cta,
        )

        saved_draft = await self._save_generated_draft(
            tenant_id=tenant_id,
            content_request=content_request,
            generated=generated,
            existing_draft=existing_draft,
        )
        return AIGenerateDraftResponse(
            draft=ContentDraftResponse.model_validate(saved_draft),
            quality_check=quality_check,
        )

    async def check_draft_quality(
        self,
        tenant_id: UUID,
        request_id: UUID,
    ) -> DraftQualityCheckResponse:
        tenant = await self.tenant_service.get_or_404(tenant_id)
        onboarding = await self._get_onboarding_or_raise(tenant_id)
        content_request = await self.content_request_service.get_or_404(
            tenant_id,
            request_id,
        )
        draft = await self._get_draft_for_request(tenant_id, request_id)
        if draft is None:
            raise BadRequestError("Content draft not found for quality check.")

        normalized_draft = AIDraftOutput(
            title=draft.title,
            caption=draft.caption or "",
            fixed_comment=draft.fixed_comment or "",
            stories_suggestion=draft.stories_suggestion or "",
            slides=[
                {
                    "slide_number": slide.slide_number,
                    "title": slide.title,
                    "body": slide.body or "",
                    "visual_notes": slide.visual_notes or "",
                }
                for slide in draft.slides
            ],
        )
        return run_quality_check(
            niche=tenant.niche,
            draft=normalized_draft,
            main_cta=content_request.cta or onboarding.main_cta,
        )

    async def _save_generated_draft(
        self,
        *,
        tenant_id: UUID,
        content_request: ContentRequest,
        generated: AIDraftOutput,
        existing_draft: ContentDraft | None,
    ) -> ContentDraft:
        if existing_draft is None:
            draft = ContentDraft(
                tenant_id=tenant_id,
                content_request_id=content_request.id,
                title=generated.title.strip(),
                caption=self._nullable_text(generated.caption),
                fixed_comment=self._nullable_text(generated.fixed_comment),
                stories_suggestion=self._nullable_text(generated.stories_suggestion),
                status=ContentDraftStatus.DRAFT,
                slides=self._build_slide_models(tenant_id, generated.slides),
            )
            self.session.add(draft)
            await self.session.commit()
            return await self._get_required_draft(tenant_id, content_request.id)

        previous_request_status = content_request.status
        existing_draft.title = generated.title.strip()
        existing_draft.caption = self._nullable_text(generated.caption)
        existing_draft.fixed_comment = self._nullable_text(generated.fixed_comment)
        existing_draft.stories_suggestion = self._nullable_text(
            generated.stories_suggestion
        )
        existing_draft.status = ContentDraftStatus.DRAFT
        existing_draft.slides = self._build_slide_models(tenant_id, generated.slides)

        if content_request.status in TEXT_RESTARTABLE_REQUEST_STATUSES:
            content_request.status = ContentRequestStatus.DRAFT
            self._add_status_event(
                tenant_id=tenant_id,
                content_request=content_request,
                content_draft=existing_draft,
                previous_status=previous_request_status,
                comment=(
                    "Content request voltou para rascunho apos "
                    "sobrescrita do draft por IA."
                ),
            )

        await self.session.commit()
        return await self._get_required_draft(tenant_id, content_request.id)

    def _validate_generated_draft(
        self,
        generated: AIDraftOutput,
        *,
        content_request: ContentRequest,
        slide_count: int,
    ) -> None:
        if not generated.title.strip():
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="OpenAI returned an empty title for the draft.",
            )
        if content_request.format == ContentFormat.CAROUSEL:
            if len(generated.slides) != slide_count:
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail=(
                        "OpenAI returned an invalid number of slides "
                        "for the request."
                    ),
                )
            slide_numbers = [slide.slide_number for slide in generated.slides]
            if slide_numbers != list(range(1, slide_count + 1)):
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail="OpenAI returned invalid slide numbering for the request.",
                )
            if any(not slide.title.strip() for slide in generated.slides):
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail="OpenAI returned a slide without title.",
                )
        elif generated.slides:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="OpenAI returned slides for a non-carousel content request.",
            )

    def _build_tenant_context(
        self,
        tenant: Tenant,
        onboarding: OnboardingProfile,
        brand_kit: Any | None,
    ) -> dict[str, Any]:
        return {
            "tenant": {
                "name": tenant.name,
                "business_name": tenant.business_name,
                "niche": tenant.niche,
            },
            "onboarding": {
                "professional_name": onboarding.professional_name,
                "instagram_handle": onboarding.instagram_handle,
                "website_url": onboarding.website_url,
                "whatsapp_number": onboarding.whatsapp_number,
                "city": onboarding.city,
                "service_mode": onboarding.service_mode.value,
                "target_audience": onboarding.target_audience,
                "audience_pain_points": onboarding.audience_pain_points,
                "main_services": onboarding.main_services,
                "desired_positioning": onboarding.desired_positioning,
                "tone_of_voice": onboarding.tone_of_voice,
                "avoid_communication": onboarding.avoid_communication,
                "brand_phrase": onboarding.brand_phrase,
                "main_cta": onboarding.main_cta,
            },
            "brand_kit": {
                "logo_url": getattr(brand_kit, "logo_url", None),
                "primary_color": getattr(brand_kit, "primary_color", None),
                "secondary_color": getattr(brand_kit, "secondary_color", None),
                "accent_color": getattr(brand_kit, "accent_color", None),
                "font_preferences": getattr(brand_kit, "font_preferences", None),
                "visual_style": getattr(brand_kit, "visual_style", None),
                "layout_preference": getattr(brand_kit, "layout_preference", None),
                "photo_usage_preference": getattr(
                    getattr(brand_kit, "photo_usage_preference", None),
                    "value",
                    None,
                ),
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
                "status": content_request.status.value,
            }
        }

    async def _get_onboarding_or_raise(self, tenant_id: UUID) -> OnboardingProfile:
        try:
            return await self.onboarding_service.get_or_404(tenant_id)
        except HTTPException as exc:
            if exc.status_code == status.HTTP_404_NOT_FOUND:
                raise BadRequestError(
                    "Onboarding profile is required before using the AI content engine."
                ) from exc
            raise

    async def _get_brand_kit_optional(self, tenant_id: UUID) -> Any | None:
        try:
            return await self.brand_kit_service.get_or_404(tenant_id)
        except HTTPException as exc:
            if exc.status_code == status.HTTP_404_NOT_FOUND:
                return None
            raise

    async def _get_draft_for_request(
        self,
        tenant_id: UUID,
        request_id: UUID,
    ) -> ContentDraft | None:
        result = await self.session.execute(
            select(ContentDraft)
            .options(selectinload(ContentDraft.slides))
            .where(
                ContentDraft.tenant_id == tenant_id,
                ContentDraft.content_request_id == request_id,
            )
        )
        return result.scalar_one_or_none()

    async def _get_required_draft(
        self,
        tenant_id: UUID,
        request_id: UUID,
    ) -> ContentDraft:
        draft = await self._get_draft_for_request(tenant_id, request_id)
        if draft is None:
            raise BadRequestError("Content draft not found after AI generation.")
        return draft

    def _build_slide_models(
        self,
        tenant_id: UUID,
        slides: list[Any],
    ) -> list[CarouselSlide]:
        return [
            CarouselSlide(
                tenant_id=tenant_id,
                slide_number=slide.slide_number,
                title=slide.title.strip(),
                body=self._nullable_text(slide.body),
                visual_notes=self._nullable_text(slide.visual_notes),
            )
            for slide in sorted(slides, key=lambda item: item.slide_number)
        ]

    def _nullable_text(self, value: str | None) -> str | None:
        if value is None:
            return None
        cleaned = value.strip()
        return cleaned or None

    def _add_status_event(
        self,
        *,
        tenant_id: UUID,
        content_request: ContentRequest,
        content_draft: ContentDraft,
        previous_status: ContentRequestStatus,
        comment: str,
    ) -> None:
        self.session.add(
            ApprovalEvent(
                tenant_id=tenant_id,
                content_request_id=content_request.id,
                content_draft_id=content_draft.id,
                event_type=ApprovalEventType.STATUS_CHANGED,
                actor_type=ApprovalActorType.SYSTEM,
                actor_name=None,
                from_status=previous_status.value,
                to_status=content_request.status.value,
                comment=comment,
                created_at=datetime.now(UTC),
            )
        )
