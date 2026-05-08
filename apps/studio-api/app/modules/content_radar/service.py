from __future__ import annotations

import json
from typing import Any, Protocol
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import Settings, get_settings
from app.modules.ai_content.service import build_openai_strict_json_schema
from app.modules.brand_kits.service import BrandKitService
from app.modules.content_radar.prompts import (
    build_radar_prompt,
    build_radar_system_prompt,
)
from app.modules.content_radar.schemas import (
    ContentRadarRequest,
    ContentRadarSuggestionsOutput,
    ContentRadarSuggestionsResponse,
)
from app.modules.content_requests.service import ContentRequestService
from app.modules.onboarding.models import OnboardingProfile
from app.modules.onboarding.service import OnboardingService
from app.modules.tenants.models import Tenant
from app.modules.tenants.service import TenantService
from app.shared.errors import BadRequestError, NotFoundError, ServiceUnavailableError

try:
    from openai import AsyncOpenAI
except ImportError:  # pragma: no cover - handled at runtime when SDK absent.
    AsyncOpenAI = None


class ContentRadarProvider(Protocol):
    async def generate_suggestions(
        self,
        *,
        tenant_context: dict[str, Any],
        request_context: dict[str, Any],
    ) -> ContentRadarSuggestionsOutput: ...


class OpenAIContentRadarProvider:
    def __init__(self, settings: Settings) -> None:
        if not settings.openai_api_key:
            raise ServiceUnavailableError(
                "STUDIO_OPENAI_API_KEY is not configured for the Studio content radar."
            )
        if AsyncOpenAI is None:
            raise ServiceUnavailableError(
                "OpenAI SDK is not installed. Run `uv sync` in apps/studio-api."
            )
        self.settings = settings
        self.client = AsyncOpenAI(api_key=settings.openai_api_key)

    async def generate_suggestions(
        self,
        *,
        tenant_context: dict[str, Any],
        request_context: dict[str, Any],
    ) -> ContentRadarSuggestionsOutput:
        payload = await self._generate_structured_output(
            schema_model=ContentRadarSuggestionsOutput,
            schema_name="studio_content_radar",
            prompt=build_radar_prompt(
                tenant_context=tenant_context,
                request_context=request_context,
            ),
        )
        return ContentRadarSuggestionsOutput.model_validate(payload)

    async def _generate_structured_output(
        self,
        *,
        schema_model: type[ContentRadarSuggestionsOutput],
        schema_name: str,
        prompt: str,
    ) -> dict[str, Any]:
        response = await self.client.responses.create(
            model=self.settings.ai_model,
            input=[
                {
                    "role": "system",
                    "content": build_radar_system_prompt(),
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
                detail="OpenAI returned an empty response for the content radar.",
            )

        try:
            return json.loads(output_text)
        except json.JSONDecodeError as exc:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="OpenAI returned invalid JSON for the content radar.",
            ) from exc


def get_content_radar_provider(
    settings: Settings | None = None,
) -> ContentRadarProvider:
    return OpenAIContentRadarProvider(settings or get_settings())


class ContentRadarService:
    def __init__(
        self,
        session: AsyncSession,
        *,
        provider: ContentRadarProvider | None = None,
        settings: Settings | None = None,
    ) -> None:
        self.session = session
        self.settings = settings or get_settings()
        self.provider = provider
        self.tenant_service = TenantService(session)
        self.onboarding_service = OnboardingService(session)
        self.brand_kit_service = BrandKitService(session)
        self.content_request_service = ContentRequestService(session)

    async def generate_suggestions(
        self,
        tenant_id: UUID,
        payload: ContentRadarRequest,
    ) -> ContentRadarSuggestionsResponse:
        tenant = await self.tenant_service.get_or_404(tenant_id)
        onboarding = await self._get_onboarding_or_raise(tenant_id)
        brand_kit = await self._get_brand_kit_optional(tenant_id)
        recent_requests = await self._list_recent_requests(tenant_id)
        provider = self.provider or get_content_radar_provider(self.settings)

        tenant_context = self._build_tenant_context(
            tenant=tenant,
            onboarding=onboarding,
            brand_kit=brand_kit,
            recent_requests=recent_requests,
        )
        request_context = {
            "count": payload.count,
            "format": payload.format.value if payload.format else None,
            "objective": payload.objective.value if payload.objective else None,
            "additional_context": payload.additional_context,
            "avoid_repeating_recent_themes": payload.avoid_repeating_recent_themes,
            "recent_requests": recent_requests,
        }

        suggestions_output = await provider.generate_suggestions(
            tenant_context=tenant_context,
            request_context=request_context,
        )
        if len(suggestions_output.suggestions) < payload.count:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="OpenAI returned fewer radar suggestions than requested.",
            )

        suggestions = suggestions_output.suggestions[: payload.count]
        for suggestion in suggestions:
            suggestion.title = suggestion.title.strip()
            suggestion.theme = suggestion.theme.strip()
            suggestion.cta = suggestion.cta.strip()
            suggestion.briefing = suggestion.briefing.strip()
            suggestion.extra_instructions = suggestion.extra_instructions.strip()
            suggestion.rationale = suggestion.rationale.strip()
            suggestion.content_angle = suggestion.content_angle.strip()

        return ContentRadarSuggestionsResponse(suggestions=suggestions)

    async def _list_recent_requests(self, tenant_id: UUID) -> list[dict[str, Any]]:
        requests = await self.content_request_service.list_for_tenant(tenant_id)
        recent_requests = [
            {
                "title": request.title,
                "theme": request.theme,
                "format": request.format.value,
                "objective": request.objective.value,
                "status": request.status.value,
                "created_at": (
                    request.created_at.isoformat() if request.created_at else None
                ),
            }
            for request in requests[:5]
        ]
        return recent_requests

    def _build_tenant_context(
        self,
        *,
        tenant: Tenant,
        onboarding: OnboardingProfile,
        brand_kit: Any | None,
        recent_requests: list[dict[str, Any]],
    ) -> dict[str, Any]:
        return {
            "tenant": {
                "name": tenant.name,
                "slug": tenant.slug,
                "business_name": tenant.business_name,
                "niche": tenant.niche,
            },
            "onboarding": {
                "professional_name": onboarding.professional_name,
                "instagram_handle": onboarding.instagram_handle,
                "website_url": onboarding.website_url,
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
            }
            if brand_kit
            else None,
            "recent_requests": recent_requests,
        }

    async def _get_onboarding_or_raise(self, tenant_id: UUID) -> OnboardingProfile:
        try:
            return await self.onboarding_service.get_or_404(tenant_id)
        except NotFoundError as exc:
            raise BadRequestError(
                "Onboarding profile is required before using the content radar."
            ) from exc

    async def _get_brand_kit_optional(self, tenant_id: UUID) -> Any | None:
        try:
            return await self.brand_kit_service.get_or_404(tenant_id)
        except NotFoundError:
            return None
