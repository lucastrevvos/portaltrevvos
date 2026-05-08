from fastapi.testclient import TestClient


def create_tenant(client: TestClient) -> dict:
    response = client.post(
        "/tenants",
        json={
            "name": "Lais Smeha",
            "slug": "lais-smeha",
            "business_name": "Lais Smeha Nutricao",
            "niche": "nutrition",
        },
    )

    assert response.status_code == 201
    return response.json()


def test_create_tenant(client: TestClient) -> None:
    tenant = create_tenant(client)

    assert tenant["slug"] == "lais-smeha"
    assert tenant["niche"] == "nutrition"


def test_create_onboarding_profile(client: TestClient) -> None:
    tenant = create_tenant(client)

    response = client.post(
        f"/tenants/{tenant['id']}/onboarding",
        json={
            "professional_name": "Lais Smeha",
            "instagram_handle": "@laissmeha",
            "website_url": "https://example.com",
            "whatsapp_number": "+5551999999999",
            "city": "Porto Alegre",
            "service_mode": "online",
            "target_audience": "Mulheres adultas que buscam reeducacao alimentar.",
            "audience_pain_points": "Falta de constancia e excesso de informacao.",
            "main_services": "Consultoria nutricional e acompanhamento.",
            "desired_positioning": "Referencia acessivel em nutricao clinica.",
            "tone_of_voice": "Claro, humano e seguro.",
            "avoid_communication": "Promessas milagrosas.",
            "brand_phrase": "Nutrir com leveza.",
            "main_cta": "Agende sua consulta.",
        },
    )

    assert response.status_code == 201
    assert response.json()["service_mode"] == "online"


def test_create_brand_kit(client: TestClient) -> None:
    tenant = create_tenant(client)

    response = client.post(
        f"/tenants/{tenant['id']}/brand-kit",
        json={
            "logo_url": "https://example.com/logo.png",
            "primary_color": "#0F766E",
            "secondary_color": "#F4D8C8",
            "accent_color": "#C75C2A",
            "font_preferences": "Fraunces e Manrope.",
            "visual_style": "Editorial clean com textura suave.",
            "photo_usage_preference": "frequent",
            "layout_preference": "Cards com respiro e hierarquia clara.",
        },
    )

    assert response.status_code == 201
    assert response.json()["photo_usage_preference"] == "frequent"


def test_create_content_request_and_patch_status(client: TestClient) -> None:
    tenant = create_tenant(client)

    create_response = client.post(
        f"/tenants/{tenant['id']}/content-requests",
        json={
            "title": "Carrossel sobre alimentacao equilibrada",
            "format": "carousel",
            "objective": "authority",
            "cta": "Agende sua consulta",
            "theme": "Como montar um prato equilibrado",
            "briefing": "Falar com profissionais ocupados.",
        },
    )

    assert create_response.status_code == 201
    assert create_response.json()["status"] == "draft"

    request_id = create_response.json()["id"]
    patch_response = client.patch(
        f"/tenants/{tenant['id']}/content-requests/{request_id}/status",
        json={"status": "awaiting_text_approval"},
    )

    assert patch_response.status_code == 200
    assert patch_response.json()["status"] == "awaiting_text_approval"
