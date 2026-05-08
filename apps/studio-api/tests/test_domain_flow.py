from pathlib import Path

from fastapi.testclient import TestClient

from app.core.config import get_settings


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


def create_onboarding(client: TestClient, tenant_id: str) -> dict:
    response = client.post(
        f"/tenants/{tenant_id}/onboarding",
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
    return response.json()


def create_brand_kit(client: TestClient, tenant_id: str) -> dict:
    response = client.post(
        f"/tenants/{tenant_id}/brand-kit",
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


def approve_draft(client: TestClient, tenant_id: str, request_id: str) -> None:
    submit_response = client.post(
        f"/tenants/{tenant_id}/content-requests/{request_id}/draft/submit",
        json={
            "actor_type": "admin",
            "actor_name": "Lucas",
            "comment": "Rascunho textual inicial preparado para aprovacao.",
        },
    )
    assert submit_response.status_code == 200

    approve_response = client.post(
        f"/tenants/{tenant_id}/content-requests/{request_id}/draft/approve",
        json={
            "actor_type": "client",
            "actor_name": "Cliente Studio",
            "comment": "Texto aprovado.",
        },
    )
    assert approve_response.status_code == 200


def create_visual_template(client: TestClient, tenant_id: str) -> dict:
    response = client.post(
        f"/tenants/{tenant_id}/visual-templates",
        json={
            "name": "Tecnico Editorial",
            "description": "Layout clean e cientifico para carrosseis educativos.",
            "category": "technical_editorial",
            "layout_rules": (
                "Fundo off-white, titulos grandes, blocos de texto com respiro, "
                "logo no topo e rodape discreto."
            ),
            "css_theme": {
                "background": "#F7F2EA",
                "primary": "#506044",
                "secondary": "#E7DDCF",
                "accent": "#B5895A",
                "titleFont": "Georgia",
                "bodyFont": "Arial",
            },
            "default_aspect_ratio": "1:1",
            "width": 1080,
            "height": 1080,
            "is_active": True,
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
    onboarding = create_onboarding(client, tenant["id"])
    assert onboarding["service_mode"] == "online"


def test_create_brand_kit(client: TestClient) -> None:
    tenant = create_tenant(client)
    brand_kit = create_brand_kit(client, tenant["id"])
    assert brand_kit["photo_usage_preference"] == "occasional"


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
    assert "Workflow-managed statuses" in response.json()["detail"]


def test_generate_render_specs_and_render_assets(client: TestClient) -> None:
    tenant = create_tenant(client)
    create_onboarding(client, tenant["id"])
    create_brand_kit(client, tenant["id"])
    content_request = create_content_request(client, tenant["id"])
    create_draft(client, tenant["id"], content_request["id"])
    approve_draft(client, tenant["id"], content_request["id"])
    visual_template = create_visual_template(client, tenant["id"])

    generate_response = client.post(
        f"/tenants/{tenant['id']}/content-requests/{content_request['id']}/render-specs/generate",
        json={
            "visual_template_id": visual_template["id"],
            "comment": "Render specs geradas para carrossel aprovado.",
        },
    )
    assert generate_response.status_code == 200
    generated_payload = generate_response.json()
    assert generated_payload["status"] == "visual_prompt_ready"
    assert len(generated_payload["render_specs"]) == 2
    assert all(spec["status"] == "ready" for spec in generated_payload["render_specs"])

    request_after_specs = client.get(
        f"/tenants/{tenant['id']}/content-requests/{content_request['id']}"
    )
    assert request_after_specs.status_code == 200
    assert request_after_specs.json()["status"] == "visual_prompt_ready"

    specs_response = client.get(
        f"/tenants/{tenant['id']}/content-requests/{content_request['id']}/render-specs"
    )
    assert specs_response.status_code == 200
    specs = specs_response.json()
    assert [spec["slide_number"] for spec in specs] == [1, 2]

    render_response = client.post(
        f"/tenants/{tenant['id']}/content-requests/{content_request['id']}/render",
        json={"comment": "Render visual iniciado."},
    )
    assert render_response.status_code == 200
    render_payload = render_response.json()
    assert render_payload["status"] == "in_manual_production"
    assert len(render_payload["assets"]) == 2
    assert all(
        asset["status"] == "ready_for_review"
        for asset in render_payload["assets"]
    )

    assets_response = client.get(
        f"/tenants/{tenant['id']}/content-requests/{content_request['id']}/creative-assets"
    )
    assert assets_response.status_code == 200
    assets = assets_response.json()
    assert len(assets) == 2
    generated_root = Path(get_settings().generated_assets_dir)
    for asset in assets:
        assert asset["file_name"].endswith(".png")
        assert asset["url"].startswith("/generated/studio/")
        rendered_file = (
            generated_root
            / tenant["slug"]
            / content_request["id"]
            / asset["file_name"]
        )
        assert rendered_file.exists()
        assert rendered_file.stat().st_size > 10_000

        slide_suffix = asset["file_name"].removesuffix(".png").split("-slide-")[-1]
        debug_html = (
            generated_root
            / tenant["slug"]
            / content_request["id"]
            / f"debug-slide-{slide_suffix}.html"
        )
        debug_log = debug_html.with_suffix(".txt")
        assert debug_html.exists()
        assert debug_log.exists()

        debug_html_content = debug_html.read_text(encoding="utf-8")
        debug_log_content = debug_log.read_text(encoding="utf-8")
        matching_spec = next(
            spec for spec in specs if spec["slide_number"] == int(slide_suffix)
        )
        assert matching_spec["title"] in debug_html_content
        assert matching_spec["body"] in debug_html_content
        assert "renderer=html_playwright" in debug_log_content
        assert "playwright_attempted=true" in debug_log_content
        assert "playwright_success=true" in debug_log_content
        assert "rendered=true" in debug_log_content
        assert "fallback_used=false" in debug_log_content

    rendered_specs_response = client.get(
        f"/tenants/{tenant['id']}/content-requests/{content_request['id']}/render-specs"
    )
    assert rendered_specs_response.status_code == 200
    assert all(
        spec["status"] == "rendered" for spec in rendered_specs_response.json()
    )

    events_response = client.get(
        f"/tenants/{tenant['id']}/content-requests/{content_request['id']}/approval-events"
    )
    assert events_response.status_code == 200
    status_events = [
        event
        for event in events_response.json()
        if event["event_type"] == "status_changed"
    ]
    assert status_events[-2]["to_status"] == "visual_prompt_ready"
    assert status_events[-1]["to_status"] == "in_manual_production"


def test_cannot_generate_render_specs_before_text_approval(client: TestClient) -> None:
    tenant = create_tenant(client)
    create_brand_kit(client, tenant["id"])
    content_request = create_content_request(client, tenant["id"])
    create_draft(client, tenant["id"], content_request["id"])
    visual_template = create_visual_template(client, tenant["id"])

    response = client.post(
        f"/tenants/{tenant['id']}/content-requests/{content_request['id']}/render-specs/generate",
        json={"visual_template_id": visual_template["id"]},
    )

    assert response.status_code == 400
    assert "text approval" in response.json()["detail"]


def test_cannot_render_without_specs(client: TestClient) -> None:
    tenant = create_tenant(client)
    content_request = create_content_request(client, tenant["id"])

    response = client.post(
        f"/tenants/{tenant['id']}/content-requests/{content_request['id']}/render",
        json={"comment": "Render visual iniciado."},
    )

    assert response.status_code == 400
    assert "visual specs are ready" in response.json()["detail"]


def test_rendering_preserves_portuguese_utf8_content(client: TestClient) -> None:
    tenant = create_tenant(client)
    create_onboarding(client, tenant["id"])
    create_brand_kit(client, tenant["id"])

    request_response = client.post(
        f"/tenants/{tenant['id']}/content-requests",
        json={
            "title": "Carrossel sobre proteína vegetal",
            "format": "carousel",
            "objective": "authority",
            "cta": "Fale com a equipe",
            "theme": "Saúde, desempenho e composição corporal",
            "briefing": "Tom claro, técnico e humano para quem treina.",
        },
    )
    assert request_response.status_code == 201
    content_request = request_response.json()

    draft_payload = {
        "title": "Proteína vegetal e composição corporal",
        "caption": "Saúde, desempenho e composição corporal começam com estratégia.",
        "fixed_comment": "Qual hábito você precisa ajustar primeiro?",
        "stories_suggestion": "Story 1: você está planejando ou só improvisando?",
        "slides": [
            {
                "slide_number": 1,
                "title": "Proteína vegetal",
                "body": "Você está planejando ou só tentando bater meta?",
                "visual_notes": "Capa limpa com tipografia forte.",
            },
            {
                "slide_number": 2,
                "title": "O erro não é ser vegetariano",
                "body": "Saúde, desempenho e composição corporal exigem contexto.",
                "visual_notes": "Bloco editorial com contraste.",
            },
        ],
    }
    draft_response = client.post(
        f"/tenants/{tenant['id']}/content-requests/{content_request['id']}/draft",
        json=draft_payload,
    )
    assert draft_response.status_code == 201
    draft = draft_response.json()
    assert draft["title"] == "Proteína vegetal e composição corporal"
    assert (
        draft["caption"]
        == "Saúde, desempenho e composição corporal começam com estratégia."
    )
    assert draft["slides"][0]["title"] == "Proteína vegetal"
    assert (
        draft["slides"][0]["body"]
        == "Você está planejando ou só tentando bater meta?"
    )
    assert draft["slides"][1]["title"] == "O erro não é ser vegetariano"

    approve_draft(client, tenant["id"], content_request["id"])
    visual_template = create_visual_template(client, tenant["id"])

    generate_response = client.post(
        f"/tenants/{tenant['id']}/content-requests/{content_request['id']}/render-specs/generate",
        json={"visual_template_id": visual_template["id"]},
    )
    assert generate_response.status_code == 200
    specs = generate_response.json()["render_specs"]
    assert specs[0]["title"] == "Proteína vegetal"
    assert specs[0]["body"] == "Você está planejando ou só tentando bater meta?"
    assert specs[1]["title"] == "O erro não é ser vegetariano"
    assert (
        specs[1]["body"]
        == "Saúde, desempenho e composição corporal exigem contexto."
    )

    render_response = client.post(
        f"/tenants/{tenant['id']}/content-requests/{content_request['id']}/render",
        json={"comment": "Render visual iniciado com UTF-8."},
    )
    assert render_response.status_code == 200
    assets = render_response.json()["assets"]
    assert len(assets) == 2

    generated_root = Path(get_settings().generated_assets_dir)
    first_asset = assets[0]
    assert "saude-desempenho-e-composicao-corporal" in first_asset["file_name"]
    assert "saúde" not in first_asset["file_name"]
    assert "composição" not in first_asset["file_name"]

    rendered_file = (
        generated_root
        / tenant["slug"]
        / content_request["id"]
        / first_asset["file_name"]
    )
    assert rendered_file.exists()
    assert rendered_file.stat().st_size > 10_000

    debug_html = (
        generated_root
        / tenant["slug"]
        / content_request["id"]
        / "debug-slide-01.html"
    )
    debug_log = debug_html.with_suffix(".txt")
    assert debug_html.exists()
    assert debug_log.exists()

    debug_html_content = debug_html.read_text(encoding="utf-8")
    debug_log_content = debug_log.read_text(encoding="utf-8")
    assert "Proteína vegetal" in debug_html_content
    assert "Você está planejando ou só tentando bater meta?" in debug_html_content
    assert "renderer=html_playwright" in debug_log_content
    assert "playwright_success=true" in debug_log_content
    assert "fallback_used=false" in debug_log_content
