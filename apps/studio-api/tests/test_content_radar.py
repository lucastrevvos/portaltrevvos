from __future__ import annotations

from typing import Any

import pytest
from fastapi.testclient import TestClient

from app.modules.content_radar.schemas import ContentRadarSuggestionsOutput


def create_tenant(client: TestClient, *, niche: str) -> dict[str, Any]:
    response = client.post(
        "/tenants",
        json={
            "name": "Studio Cliente",
            "slug": f"studio-cliente-{niche}",
            "business_name": "Studio Cliente",
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
            "instagram_handle": "@studio",
            "website_url": "https://example.com",
            "whatsapp_number": "+5551999999999",
            "city": "Porto Alegre",
            "service_mode": "online",
            "target_audience": "Publico estrategico.",
            "audience_pain_points": "Dor, duvida e travamento.",
            "main_services": "Consultoria e estrategia.",
            "desired_positioning": "Tecnico e premium.",
            "tone_of_voice": "Claro, humano e seguro.",
            "avoid_communication": "Promessa milagrosa.",
            "brand_phrase": "Estratégia com contexto.",
            "main_cta": "Agende uma conversa.",
        },
    )
    assert response.status_code == 201
    return response.json()


def create_content_request(client: TestClient, tenant_id: str) -> dict[str, Any]:
    response = client.post(
        f"/tenants/{tenant_id}/content-requests",
        json={
            "title": "Pedido base",
            "format": "carousel",
            "objective": "authority",
            "cta": "Saiba mais",
            "theme": "Tema base",
            "briefing": "Briefing base.",
        },
    )
    assert response.status_code == 201
    return response.json()


class FakeRadarProvider:
    async def generate_suggestions(
        self,
        *,
        tenant_context: dict[str, Any],
        request_context: dict[str, Any],
    ) -> ContentRadarSuggestionsOutput:
        niche = (tenant_context["tenant"]["niche"] or "").casefold()
        count = request_context["count"]
        base_format = request_context["format"] or "carousel"
        base_objective = request_context["objective"] or "education"

        if niche in {"driver_app", "mobility", "finance", "app", "saas"}:
            suggestions = [
                {
                    "title": "O valor bruto da corrida está te enganando?",
                    "theme": "Diferença entre faturamento bruto e lucro líquido.",
                    "format": base_format,
                    "objective": base_objective,
                    "cta": "Entenda o seu custo por km",
                    "briefing": (
                        "Criar um carrossel educativo sobre como lucro real "
                        "exige leitura de lucro líquido, custo, meta e rotina."
                    ),
                    "extra_instructions": (
                        "Usar linguagem direta, urbana e prática. "
                        "Não prometer ganhos garantidos."
                    ),
                    "rationale": "Conversa com uma dor recorrente do público.",
                    "content_angle": "educational_pain",
                    "estimated_difficulty": "easy",
                    "risk_level": "low",
                }
                for _ in range(count)
            ]
        else:
            suggestions = [
                {
                    "title": (
                        "Proteína vegetal: você está planejando ou só tentando "
                        "bater meta?"
                    ),
                    "theme": "Saúde, desempenho e composição corporal com contexto.",
                    "format": base_format,
                    "objective": base_objective,
                    "cta": "Agende uma avaliação",
                    "briefing": (
                        "Criar um carrossel técnico, premium e científico sobre "
                        "planejamento alimentar."
                    ),
                    "extra_instructions": (
                        "Evitar promessas milagrosas e prescrição individualizada."
                    ),
                    "rationale": "Reflete uma dor central do público com autoridade.",
                    "content_angle": "educational_pain",
                    "estimated_difficulty": "medium",
                    "risk_level": "low",
                }
                for _ in range(count)
            ]

        return ContentRadarSuggestionsOutput(suggestions=suggestions)


@pytest.fixture
def fake_provider(monkeypatch: pytest.MonkeyPatch) -> FakeRadarProvider:
    provider = FakeRadarProvider()
    monkeypatch.setattr(
        "app.modules.content_radar.service.get_content_radar_provider",
        lambda settings=None: provider,
    )
    return provider


def test_content_radar_requires_onboarding(
    client: TestClient,
    fake_provider: FakeRadarProvider,
) -> None:
    tenant = create_tenant(client, niche="driver_app")
    create_content_request(client, tenant["id"])

    response = client.post(
        f"/tenants/{tenant['id']}/content-radar/suggestions",
        json={"count": 3},
    )

    assert response.status_code == 400
    assert (
        response.json()["detail"]
        == "Onboarding profile is required before using the content radar."
    )


def test_content_radar_generates_utf8_and_count_for_nutrition(
    client: TestClient,
    fake_provider: FakeRadarProvider,
) -> None:
    tenant = create_tenant(client, niche="nutrition")
    create_onboarding(client, tenant["id"])

    response = client.post(
        f"/tenants/{tenant['id']}/content-radar/suggestions",
        json={
            "count": 4,
            "format": "carousel",
            "objective": "authority",
            "additional_context": "Foco em vegetarianos ativos.",
        },
    )

    assert response.status_code == 200
    payload = response.json()
    assert len(payload["suggestions"]) == 4
    assert "Proteína vegetal" in payload["suggestions"][0]["title"]
    assert "composição corporal" in payload["suggestions"][0]["theme"]
    assert payload["suggestions"][0]["risk_level"] == "low"


def test_content_radar_driver_app_avoids_guaranteed_gains(
    client: TestClient,
    fake_provider: FakeRadarProvider,
) -> None:
    tenant = create_tenant(client, niche="driver_app")
    create_onboarding(client, tenant["id"])

    response = client.post(
        f"/tenants/{tenant['id']}/content-radar/suggestions",
        json={
            "count": 2,
            "format": "carousel",
            "objective": "education",
            "additional_context": "Motoristas que confundem faturamento com lucro.",
        },
    )

    assert response.status_code == 200
    payload = response.json()
    assert len(payload["suggestions"]) == 2
    assert "garant" not in payload["suggestions"][0]["title"].casefold()
    assert "lucro líquido" in payload["suggestions"][0]["briefing"].casefold()
