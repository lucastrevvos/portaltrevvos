from app.modules.brand_kits.models import BrandKit
from app.modules.content_drafts.models import ApprovalEvent, ContentDraft
from app.modules.content_requests.models import ContentRequest
from app.modules.onboarding.models import OnboardingProfile
from app.modules.render_specs.models import CreativeAsset, ImageRenderJob, RenderSpec
from app.modules.visual_templates.models import VisualTemplate


def test_sqlalchemy_enums_use_lowercase_values() -> None:
    assert OnboardingProfile.__table__.c.service_mode.type.enums == [
        "online",
        "presencial",
        "hibrido",
    ]
    assert BrandKit.__table__.c.photo_usage_preference.type.enums == [
        "frequent",
        "occasional",
        "avoid",
        "unknown",
    ]
    assert ContentRequest.__table__.c.format.type.enums == [
        "static_post",
        "carousel",
        "story_sequence",
        "reel_script",
        "landing_page",
        "logo",
        "visual_identity",
    ]
    assert ContentRequest.__table__.c.objective.type.enums == [
        "authority",
        "engagement",
        "conversion",
        "education",
        "lead_generation",
        "brand_awareness",
    ]
    assert ContentRequest.__table__.c.status.type.enums == [
        "draft",
        "awaiting_text_approval",
        "text_revision_requested",
        "text_approved",
        "visual_prompt_ready",
        "in_manual_production",
        "awaiting_final_approval",
        "final_revision_requested",
        "delivered",
        "cancelled",
    ]
    assert ContentDraft.__table__.c.status.type.enums == [
        "draft",
        "awaiting_approval",
        "revision_requested",
        "approved",
    ]
    assert ApprovalEvent.__table__.c.event_type.type.enums == [
        "text_submitted",
        "text_revision_requested",
        "text_approved",
        "status_changed",
    ]
    assert ApprovalEvent.__table__.c.actor_type.type.enums == [
        "admin",
        "client",
        "system",
    ]
    assert VisualTemplate.__table__.c.category.type.enums == [
        "institutional_premium",
        "technical_editorial",
        "human_connection",
        "conversion_focused",
        "minimalist_scientific",
        "custom",
    ]
    assert RenderSpec.__table__.c.render_type.type.enums == [
        "cover_slide",
        "carousel_slide",
        "closing_slide",
        "static_post",
        "story",
    ]
    assert RenderSpec.__table__.c.status.type.enums == [
        "draft",
        "ready",
        "rendered",
        "discarded",
    ]
    assert ImageRenderJob.__table__.c.status.type.enums == [
        "pending",
        "running",
        "completed",
        "failed",
    ]
    assert CreativeAsset.__table__.c.asset_type.type.enums == [
        "rendered_slide",
        "final_delivery",
        "reference",
        "logo",
        "photo",
        "generated_background",
    ]
    assert CreativeAsset.__table__.c.status.type.enums == [
        "draft",
        "ready_for_review",
        "approved",
        "rejected",
        "discarded",
    ]
