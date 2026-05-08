from __future__ import annotations

from typing import Any

import pytest
from fastapi.testclient import TestClient

from app.core.config import get_settings
from app.modules.ai_content.schemas import AIDraftOutput, AIIdeasOutput


def create_tenant(client: TestClient, *, niche: str = "nutrition") -> dict[str, Any]:
    response = client.post(
        "/tenants",
        json={
            "name": "Clinica Performance",
            "slug": "clinica-performance",
            "business_name": "Clinica Performance",
            "niche": niche,
        },
    )
    assert response.status_code == 201
    return response.json()


def create_onboarding(client: TestClient, tenant_id: str) -> dict[str, Any]:
    response = client.post(
        f"/tenants/{tenant_id}/onboarding",
        json={
            "professional_name": "Dra. Marina",
            "instagram_handle": "@clinicaperformance",
            "website_url": "https://example.com",
            "whatsapp_number": "+5551999999999",
            "city": "Porto Alegre",
            "service_mode": "online",
            "target_audience": "Vegetarianos que treinam e querem melhorar desempenho.",
            "audience_pain_points": "Dificuldade com proteina, rotina e planejamento.",
            "main_services": "Consultoria nutricional esportiva.",
            "desired_positioning": "Tecnica, premium e humana.",
            "tone_of_voice": "Educativo, claro e seguro.",
            "avoid_communication": "Promessas milagrosas e terrorismo alimentar.",
            "brand_phrase": "Estrategia nutricional com contexto.",
            "main_cta": "Agende uma avaliacao.",
        },
    )
    assert response.status_code == 201
    return response.json()


def create_content_request(client: TestClient, tenant_id: str) -> dict[str, Any]:
    response = client.post(
        f"/tenants/{tenant_id}/content-requests",
        json={
            "title": "Carrossel sobre proteina vegetal",
            "format": "carousel",
            "objective": "authority",
            "cta": "Agende sua consulta",
            "theme": "Proteína vegetal para quem treina",
            "briefing": "Tom técnico, premium e científico. Evitar promessas.",
        },
    )
    assert response.status_code == 201
    return response.json()


def create_manual_draft_payload() -> dict[str, Any]:
    return {
        "title": "Proteina vegetal em 5 etapas",
        "caption": "Saude, desempenho e composicao corporal com contexto.",
        "fixed_comment": "Qual etapa voce precisa revisar primeiro?",
        "stories_suggestion": "Story 1: qual erro aparece mais na sua rotina?",
        "slides": [
            {
                "slide_number": index,
                "title": f"Slide {index}",
                "body": f"Texto original do slide {index}.",
                "visual_notes": f"Nota visual {index}.",
            }
            for index in range(1, 6)
        ],
    }


def create_updated_draft_payload() -> dict[str, Any]:
    return {
        "title": "Proteina vegetal revisada",
        "caption": "Legenda atualizada com mais contexto.",
        "fixed_comment": "Comentario fixado atualizado.",
        "stories_suggestion": "Sugestao de stories atualizada.",
        "slides": [
            {
                "slide_number": index,
                "title": f"Slide {index} atualizado",
                "body": f"Texto novo do slide {index}.",
                "visual_notes": f"Nota visual nova {index}.",
            }
            for index in range(1, 6)
        ],
    }


class FakeAIProvider:
    async def generate_content_ideas(
        self,
        *,
        tenant_context: dict[str, Any],
        request_context: dict[str, Any],
    ) -> AIIdeasOutput:
        return AIIdeasOutput(
            ideas=[
                {
                    "title": "3 erros na proteína vegetal de quem treina",
                    "format": request_context["format"],
                    "objective": request_context["goal"],
                    "rationale": (
                        "Reforça especialização e educa sem prometer resultado."
                    ),
                    "cta_suggestion": "Agende sua consulta",
                }
                for _ in range(request_context["count"])
            ]
        )

    async def generate_draft(
        self,
        *,
        tenant_context: dict[str, Any],
        request_context: dict[str, Any],
        slide_count: int,
        extra_instructions: str | None,
    ) -> AIDraftOutput:
        return AIDraftOutput(
            title="Proteína vegetal: você está planejando ou só tentando bater meta?",
            caption=(
                "Saúde, desempenho e composição corporal pedem "
                "estratégia, não improviso."
            ),
            fixed_comment="Qual etapa da sua rotina merece mais planejamento hoje?",
            stories_suggestion="Story 1: onde a proteína vegetal trava sua rotina?",
            slides=[
                {
                    "slide_number": index,
                    "title": (
                        "Proteína vegetal"
                        if index == 1
                        else "O erro não é ser vegetariano"
                    ),
                    "body": (
                        "Você está planejando ou só tentando bater meta?"
                        if index == 1
                        else "Saúde, desempenho e composição corporal exigem contexto."
                    ),
                    "visual_notes": "Layout editorial limpo e legível.",
                }
                for index in range(1, slide_count + 1)
            ],
        )


@pytest.fixture
def fake_provider(monkeypatch: pytest.MonkeyPatch) -> FakeAIProvider:
    provider = FakeAIProvider()
    monkeypatch.setattr(
        "app.modules.ai_content.service.get_ai_provider",
        lambda settings=None: provider,
    )
    return provider


def test_ai_generate_draft_requires_onboarding(
    client: TestClient,
    fake_provider: FakeAIProvider,
) -> None:
    tenant = create_tenant(client)
    content_request = create_content_request(client, tenant["id"])

    response = client.post(
        f"/tenants/{tenant['id']}/content-requests/{content_request['id']}/ai/generate-draft",
        json={"slide_count": 5},
    )

    assert response.status_code == 400
    assert (
        response.json()["detail"]
        == "Onboarding profile is required before using the AI content engine."
    )


def test_ai_generate_draft_preserves_utf8_and_creates_slides(
    client: TestClient,
    fake_provider: FakeAIProvider,
) -> None:
    tenant = create_tenant(client)
    create_onboarding(client, tenant["id"])
    content_request = create_content_request(client, tenant["id"])

    response = client.post(
        f"/tenants/{tenant['id']}/content-requests/{content_request['id']}/ai/generate-draft",
        json={
            "slide_count": 5,
            "extra_instructions": "Manter tom técnico, premium e científico.",
        },
    )

    assert response.status_code == 200
    payload = response.json()
    assert (
        payload["draft"]["title"]
        == "Proteína vegetal: você está planejando ou só tentando bater meta?"
    )
    assert (
        payload["draft"]["caption"]
        == "Saúde, desempenho e composição corporal pedem estratégia, não improviso."
    )
    assert payload["draft"]["status"] == "draft"
    assert len(payload["draft"]["slides"]) == 5
    assert payload["draft"]["slides"][0]["title"] == "Proteína vegetal"
    assert (
        payload["draft"]["slides"][1]["title"]
        == "O erro não é ser vegetariano"
    )
    assert payload["quality_check"]["risk_level"] == "low"


def test_ai_generate_draft_blocks_overwrite_for_approved_draft(
    client: TestClient,
    fake_provider: FakeAIProvider,
) -> None:
    tenant = create_tenant(client)
    create_onboarding(client, tenant["id"])
    content_request = create_content_request(client, tenant["id"])

    generate_response = client.post(
        f"/tenants/{tenant['id']}/content-requests/{content_request['id']}/ai/generate-draft",
        json={"slide_count": 5},
    )
    assert generate_response.status_code == 200

    submit_response = client.post(
        f"/tenants/{tenant['id']}/content-requests/{content_request['id']}/draft/submit",
        json={
            "actor_type": "admin",
            "actor_name": "Admin Studio",
            "comment": "Draft submetido.",
        },
    )
    assert submit_response.status_code == 200

    approve_response = client.post(
        f"/tenants/{tenant['id']}/content-requests/{content_request['id']}/draft/approve",
        json={
            "actor_type": "client",
            "actor_name": "Cliente Studio",
            "comment": "Draft aprovado.",
        },
    )
    assert approve_response.status_code == 200

    overwrite_response = client.post(
        f"/tenants/{tenant['id']}/content-requests/{content_request['id']}/ai/generate-draft",
        json={"slide_count": 5, "overwrite": True},
    )

    assert overwrite_response.status_code == 409
    assert (
        overwrite_response.json()["detail"]
        == "Draft aprovado nao pode ser sobrescrito nesta versao. "
        "Versionamento sera implementado futuramente."
    )


def test_ai_quality_check_detects_risk_terms(
    client: TestClient,
    fake_provider: FakeAIProvider,
) -> None:
    tenant = create_tenant(client)
    create_onboarding(client, tenant["id"])
    content_request = create_content_request(client, tenant["id"])

    draft_response = client.post(
        f"/tenants/{tenant['id']}/content-requests/{content_request['id']}/draft",
        json={
            "title": "Resultado garantido com proteína vegetal",
            "caption": "Emagreça em 7 dias com suplemento obrigatório.",
            "fixed_comment": "Coma exatamente isso todos os dias.",
            "stories_suggestion": "Dieta para você treinar sem falhar.",
            "slides": [
                {
                    "slide_number": 1,
                    "title": "Resultado garantido",
                    "body": "Suplemento obrigatório para todo mundo.",
                    "visual_notes": "Texto direto.",
                }
            ],
        },
    )
    assert draft_response.status_code == 201

    quality_response = client.post(
        f"/tenants/{tenant['id']}/content-requests/{content_request['id']}/ai/check-draft-quality"
    )

    assert quality_response.status_code == 200
    payload = quality_response.json()
    assert payload["approved"] is False
    assert payload["risk_level"] == "high"
    assert any(
        "garantidas" in warning or "garantida" in warning
        for warning in payload["warnings"]
    )


def test_ai_content_ideas_returns_requested_count(
    client: TestClient,
    fake_provider: FakeAIProvider,
) -> None:
    tenant = create_tenant(client)
    create_onboarding(client, tenant["id"])

    response = client.post(
        f"/tenants/{tenant['id']}/ai/content-ideas",
        json={
            "goal": "authority",
            "count": 3,
            "format": "carousel",
            "additional_context": "Foco em vegetarianos que treinam.",
        },
    )

    assert response.status_code == 200
    payload = response.json()
    assert len(payload["ideas"]) == 3
    assert payload["ideas"][0]["title"] == "3 erros na proteína vegetal de quem treina"


def test_update_draft_replaces_existing_slides(
    client: TestClient,
    fake_provider: FakeAIProvider,
) -> None:
    tenant = create_tenant(client)
    create_onboarding(client, tenant["id"])
    content_request = create_content_request(client, tenant["id"])

    create_response = client.post(
        f"/tenants/{tenant['id']}/content-requests/{content_request['id']}/draft",
        json=create_manual_draft_payload(),
    )
    assert create_response.status_code == 201

    update_response = client.put(
        f"/tenants/{tenant['id']}/content-requests/{content_request['id']}/draft",
        json=create_updated_draft_payload(),
    )

    assert update_response.status_code == 200
    updated = update_response.json()
    assert len(updated["slides"]) == 5
    assert updated["slides"][0]["title"] == "Slide 1 atualizado"
    assert updated["slides"][0]["body"] == "Texto novo do slide 1."
    assert updated["slides"][4]["visual_notes"] == "Nota visual nova 5."

    get_response = client.get(
        f"/tenants/{tenant['id']}/content-requests/{content_request['id']}/draft"
    )
    assert get_response.status_code == 200
    assert len(get_response.json()["slides"]) == 5


def test_update_ai_generated_draft_replaces_existing_slides(
    client: TestClient,
    fake_provider: FakeAIProvider,
) -> None:
    tenant = create_tenant(client)
    create_onboarding(client, tenant["id"])
    content_request = create_content_request(client, tenant["id"])

    generate_response = client.post(
        f"/tenants/{tenant['id']}/content-requests/{content_request['id']}/ai/generate-draft",
        json={"slide_count": 5},
    )
    assert generate_response.status_code == 200

    update_response = client.put(
        f"/tenants/{tenant['id']}/content-requests/{content_request['id']}/draft",
        json=create_updated_draft_payload(),
    )

    assert update_response.status_code == 200
    updated = update_response.json()
    assert len(updated["slides"]) == 5
    assert updated["slides"][0]["title"] == "Slide 1 atualizado"
    assert updated["slides"][1]["body"] == "Texto novo do slide 2."


def test_update_without_slides_keeps_existing_slides(
    client: TestClient,
    fake_provider: FakeAIProvider,
) -> None:
    tenant = create_tenant(client)
    create_onboarding(client, tenant["id"])
    content_request = create_content_request(client, tenant["id"])

    create_response = client.post(
        f"/tenants/{tenant['id']}/content-requests/{content_request['id']}/draft",
        json=create_manual_draft_payload(),
    )
    assert create_response.status_code == 201

    update_response = client.put(
        f"/tenants/{tenant['id']}/content-requests/{content_request['id']}/draft",
        json={
            "title": "Proteina vegetal sem trocar slides",
            "caption": "Atualizacao apenas nos campos principais.",
            "fixed_comment": "Mantendo os slides existentes.",
            "stories_suggestion": "Stories mantidos.",
        },
    )

    assert update_response.status_code == 200
    updated = update_response.json()
    assert len(updated["slides"]) == 5
    assert updated["slides"][0]["title"] == "Slide 1"


def test_ai_generate_draft_returns_clear_error_without_api_key(
    client: TestClient,
) -> None:
    settings = get_settings()
    original_key = settings.openai_api_key
    settings.openai_api_key = None
    try:
        tenant = create_tenant(client)
        create_onboarding(client, tenant["id"])
        content_request = create_content_request(client, tenant["id"])

        response = client.post(
            f"/tenants/{tenant['id']}/content-requests/{content_request['id']}/ai/generate-draft",
            json={"slide_count": 5},
        )
    finally:
        settings.openai_api_key = original_key

    assert response.status_code == 503
    assert (
        response.json()["detail"]
        == "STUDIO_OPENAI_API_KEY is not configured for the Studio AI content engine."
    )
