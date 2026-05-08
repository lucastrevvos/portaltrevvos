from __future__ import annotations

from io import BytesIO
from pathlib import Path

from fastapi.testclient import TestClient
from PIL import Image
from test_domain_flow import (
    approve_draft,
    create_brand_kit,
    create_content_request,
    create_draft,
    create_onboarding,
    create_tenant,
    create_visual_template,
)

from app.core.config import get_settings


def make_png_bytes(color: tuple[int, int, int]) -> bytes:
    image = Image.new("RGB", (256, 256), color=color)
    buffer = BytesIO()
    image.save(buffer, format="PNG")
    return buffer.getvalue()


def upload_brand_asset(
    client: TestClient,
    tenant_id: str,
    *,
    asset_type: str,
    label: str,
    is_primary: bool,
    filename: str,
    contents: bytes,
) -> dict:
    response = client.post(
        f"/tenants/{tenant_id}/brand-assets",
        files={"file": (filename, contents, "image/png")},
        data={
            "type": asset_type,
            "label": label,
            "is_primary": str(is_primary).lower(),
        },
    )
    assert response.status_code == 201
    return response.json()


def prepare_request_with_specs(client: TestClient) -> tuple[dict, dict, dict]:
    tenant = create_tenant(client)
    create_onboarding(client, tenant["id"])
    create_brand_kit(client, tenant["id"])
    content_request = create_content_request(client, tenant["id"])
    create_draft(client, tenant["id"], content_request["id"])
    approve_draft(client, tenant["id"], content_request["id"])
    visual_template = create_visual_template(client, tenant["id"])

    generate_response = client.post(
        f"/tenants/{tenant['id']}/content-requests/{content_request['id']}/render-specs/generate",
        json={"visual_template_id": visual_template["id"]},
    )
    assert generate_response.status_code == 200

    return tenant, content_request, visual_template


def test_brand_asset_upload_sets_primary_logo_and_render_uses_it(
    client: TestClient,
) -> None:
    tenant = create_tenant(client)
    create_onboarding(client, tenant["id"])
    create_brand_kit(client, tenant["id"])

    uploaded_logo = upload_brand_asset(
        client,
        tenant["id"],
        asset_type="logo",
        label="Logo principal",
        is_primary=True,
        filename="marca-logo.png",
        contents=make_png_bytes((34, 85, 64)),
    )

    assert uploaded_logo["asset_type"] == "logo"
    assert uploaded_logo["is_primary"] is True

    assets_response = client.get(f"/tenants/{tenant['id']}/brand-assets")
    assert assets_response.status_code == 200
    assets = assets_response.json()
    assert len(assets) == 1
    assert assets[0]["is_primary"] is True

    content_request = create_content_request(client, tenant["id"])
    create_draft(client, tenant["id"], content_request["id"])
    approve_draft(client, tenant["id"], content_request["id"])
    visual_template = create_visual_template(client, tenant["id"])

    generate_response = client.post(
        f"/tenants/{tenant['id']}/content-requests/{content_request['id']}/render-specs/generate",
        json={"visual_template_id": visual_template["id"]},
    )
    assert generate_response.status_code == 200

    render_response = client.post(
        f"/tenants/{tenant['id']}/content-requests/{content_request['id']}/render",
        json={"comment": "Render com logo enviado pela marca."},
    )
    assert render_response.status_code == 200
    assets = render_response.json()["assets"]
    assert assets

    debug_html = (
        Path(get_settings().generated_assets_dir)
        / tenant["slug"]
        / content_request["id"]
        / "debug-slide-01.html"
    )
    debug_html_content = debug_html.read_text(encoding="utf-8")
    assert "data:image/png;base64," in debug_html_content


def test_ai_visual_backgrounds_generate_and_render_hybrid(
    client: TestClient,
    monkeypatch,
) -> None:
    tenant, content_request, _ = prepare_request_with_specs(client)

    class FakeAIVisualProvider:
        async def generate_background(self, *, prompt: str) -> bytes:
            assert prompt.strip()
            return make_png_bytes((201, 179, 145))

    monkeypatch.setattr(
        "app.modules.ai_visual.service.get_ai_visual_provider",
        lambda settings=None: FakeAIVisualProvider(),
    )

    render_response = client.post(
        f"/tenants/{tenant['id']}/content-requests/{content_request['id']}/render",
        json={
            "mode": "ai_visual",
            "comment": "Tentativa antes dos fundos.",
        },
    )
    assert render_response.status_code == 400
    assert "backgrounds are missing" in render_response.json()["detail"]

    generate_backgrounds_response = client.post(
        f"/tenants/{tenant['id']}/content-requests/{content_request['id']}/ai/generate-visual-backgrounds",
        json={
            "overwrite": False,
            "style_mode": "brand_aligned",
            "slides": [1, 2],
        },
    )
    assert generate_backgrounds_response.status_code == 200
    backgrounds = generate_backgrounds_response.json()["generated_backgrounds"]
    assert len(backgrounds) == 2

    list_backgrounds_response = client.get(
        f"/tenants/{tenant['id']}/content-requests/{content_request['id']}/ai/visual-backgrounds"
    )
    assert list_backgrounds_response.status_code == 200
    assert len(list_backgrounds_response.json()) == 2

    render_hybrid_response = client.post(
        f"/tenants/{tenant['id']}/content-requests/{content_request['id']}/render",
        json={
            "mode": "ai_visual",
            "comment": "Render com IA visual.",
        },
    )
    assert render_hybrid_response.status_code == 200
    hybrid_assets = render_hybrid_response.json()["assets"]
    assert len(hybrid_assets) == 4
    generated_backgrounds = [
        asset
        for asset in hybrid_assets
        if asset["asset_type"] == "generated_background"
    ]
    rendered_slides = [
        asset for asset in hybrid_assets if asset["asset_type"] == "rendered_slide"
    ]
    assert len(generated_backgrounds) == 2
    assert len(rendered_slides) == 2
    assert all(asset["status"] == "ready_for_review" for asset in hybrid_assets)

    generated_root = Path(get_settings().generated_assets_dir)
    debug_html = (
        generated_root
        / tenant["slug"]
        / content_request["id"]
        / "debug-slide-01.html"
    )
    debug_html_content = debug_html.read_text(encoding="utf-8")
    assert "Direcao visual" not in debug_html_content
    assert "Capa limpa com tipografia forte." not in debug_html_content
    assert "Sem logo enviado" not in debug_html_content
    assert "mode-ai_visual" in debug_html_content
