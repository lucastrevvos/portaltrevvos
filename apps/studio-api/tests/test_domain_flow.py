from fastapi.testclient import TestClient


def create_tenant(client: TestClient) -> dict:
    response = client.post(
        "/tenants",
        json={
            "name": "Atelie Conteudo",
            "slug": "atelie-conteudo",
            "business_name": "Atelie Conteudo Estrategico",
            "niche": "content_strategy",
        },
    )

    assert response.status_code == 201
    return response.json()


def create_content_request(client: TestClient, tenant_id: str) -> dict:
    response = client.post(
        f"/tenants/{tenant_id}/content-requests",
        json={
            "title": "Carrossel sobre organizacao de rotina",
            "format": "carousel",
            "objective": "authority",
            "cta": "Fale com a equipe",
            "theme": "Como estruturar uma semana de conteudo",
            "briefing": "Tom claro e confiante para pequenos negocios.",
        },
    )

    assert response.status_code == 201
    return response.json()


def create_draft(client: TestClient, tenant_id: str, request_id: str) -> dict:
    response = client.post(
        f"/tenants/{tenant_id}/content-requests/{request_id}/draft",
        json={
            "title": "Organizacao de conteudo nao comeca no Canva",
            "caption": (
                "Antes do layout, voce precisa clareza sobre objetivo e narrativa."
            ),
            "fixed_comment": "Qual parte da sua rotina mais trava a constancia?",
            "stories_suggestion": "Story 1: onde sua rotina quebra hoje?",
            "slides": [
                {
                    "slide_number": 2,
                    "title": "O erro mais comum",
                    "body": "Comecar pelo visual antes de definir mensagem e CTA.",
                    "visual_notes": "Bullets com contraste editorial.",
                },
                {
                    "slide_number": 1,
                    "title": "Organizacao de conteudo",
                    "body": "Nao comeca no Canva. Comeca na estrategia.",
                    "visual_notes": "Capa limpa com tipografia forte.",
                },
            ],
        },
    )

    assert response.status_code == 201
    return response.json()


def test_create_tenant(client: TestClient) -> None:
    tenant = create_tenant(client)

    assert tenant["slug"] == "atelie-conteudo"
    assert tenant["niche"] == "content_strategy"


def test_create_onboarding_profile(client: TestClient) -> None:
    tenant = create_tenant(client)

    response = client.post(
        f"/tenants/{tenant['id']}/onboarding",
        json={
            "professional_name": "Equipe Atelie",
            "instagram_handle": "@atelieconteudo",
            "website_url": "https://example.com",
            "whatsapp_number": "+5551999999999",
            "city": "Porto Alegre",
            "service_mode": "online",
            "target_audience": "Pequenos negocios com operacao enxuta.",
            "audience_pain_points": "Falta de processo e constancia de publicacao.",
            "main_services": "Planejamento, redacao e curadoria visual.",
            "desired_positioning": "Parceiro estrategico e pratico.",
            "tone_of_voice": "Direto, humano e confiavel.",
            "avoid_communication": "Promessas vagas e jargao vazio.",
            "brand_phrase": "Conteudo com criterio.",
            "main_cta": "Solicite um plano inicial.",
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
            "primary_color": "#0F172A",
            "secondary_color": "#F3EDE2",
            "accent_color": "#C75C2A",
            "font_preferences": "Fraunces e Manrope.",
            "visual_style": "Editorial clean com ritmo e contraste.",
            "photo_usage_preference": "occasional",
            "layout_preference": "Cards com respiro e hierarquia clara.",
        },
    )

    assert response.status_code == 201
    assert response.json()["photo_usage_preference"] == "occasional"


def test_textual_workflow_with_draft_slides_and_events(client: TestClient) -> None:
    tenant = create_tenant(client)
    content_request = create_content_request(client, tenant["id"])
    draft = create_draft(client, tenant["id"], content_request["id"])

    assert draft["status"] == "draft"
    assert [slide["slide_number"] for slide in draft["slides"]] == [1, 2]

    get_draft_response = client.get(
        f"/tenants/{tenant['id']}/content-requests/{content_request['id']}/draft"
    )
    assert get_draft_response.status_code == 200
    assert [
        slide["slide_number"] for slide in get_draft_response.json()["slides"]
    ] == [1, 2]

    submit_response = client.post(
        f"/tenants/{tenant['id']}/content-requests/{content_request['id']}/draft/submit",
        json={
            "actor_type": "admin",
            "actor_name": "Lucas",
            "comment": "Rascunho textual inicial preparado para aprovacao.",
        },
    )
    assert submit_response.status_code == 200
    assert submit_response.json()["status"] == "awaiting_approval"

    request_after_submit = client.get(
        f"/tenants/{tenant['id']}/content-requests/{content_request['id']}"
    )
    assert request_after_submit.status_code == 200
    assert request_after_submit.json()["status"] == "awaiting_text_approval"

    revision_response = client.post(
        f"/tenants/{tenant['id']}/content-requests/{content_request['id']}/draft/request-revision",
        json={
            "actor_type": "client",
            "actor_name": "Cliente Studio",
            "comment": "Reduzir o texto do slide 2 e deixar menos tecnico.",
        },
    )
    assert revision_response.status_code == 200
    assert revision_response.json()["status"] == "revision_requested"

    request_after_revision = client.get(
        f"/tenants/{tenant['id']}/content-requests/{content_request['id']}"
    )
    assert request_after_revision.status_code == 200
    assert request_after_revision.json()["status"] == "text_revision_requested"

    resubmit_response = client.post(
        f"/tenants/{tenant['id']}/content-requests/{content_request['id']}/draft/submit",
        json={
            "actor_type": "admin",
            "actor_name": "Lucas",
            "comment": "Ajustes aplicados e reenviados para aprovacao.",
        },
    )
    assert resubmit_response.status_code == 200
    assert resubmit_response.json()["status"] == "awaiting_approval"

    approve_response = client.post(
        f"/tenants/{tenant['id']}/content-requests/{content_request['id']}/draft/approve",
        json={
            "actor_type": "client",
            "actor_name": "Cliente Studio",
            "comment": "Texto aprovado.",
        },
    )
    assert approve_response.status_code == 200
    assert approve_response.json()["status"] == "approved"

    request_after_approval = client.get(
        f"/tenants/{tenant['id']}/content-requests/{content_request['id']}"
    )
    assert request_after_approval.status_code == 200
    assert request_after_approval.json()["status"] == "text_approved"

    events_response = client.get(
        f"/tenants/{tenant['id']}/content-requests/{content_request['id']}/approval-events"
    )
    assert events_response.status_code == 200
    event_types = [event["event_type"] for event in events_response.json()]
    assert event_types == [
        "text_submitted",
        "status_changed",
        "text_revision_requested",
        "status_changed",
        "text_submitted",
        "status_changed",
        "text_approved",
        "status_changed",
    ]


def test_cannot_approve_without_draft(client: TestClient) -> None:
    tenant = create_tenant(client)
    content_request = create_content_request(client, tenant["id"])

    response = client.post(
        f"/tenants/{tenant['id']}/content-requests/{content_request['id']}/draft/approve",
        json={
            "actor_type": "client",
            "actor_name": "Cliente Studio",
            "comment": "Texto aprovado.",
        },
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Content draft not found."


def test_manual_patch_cannot_force_text_status(client: TestClient) -> None:
    tenant = create_tenant(client)
    content_request = create_content_request(client, tenant["id"])

    response = client.patch(
        f"/tenants/{tenant['id']}/content-requests/{content_request['id']}/status",
        json={"status": "awaiting_text_approval"},
    )

    assert response.status_code == 409
    assert "Text workflow statuses" in response.json()["detail"]
