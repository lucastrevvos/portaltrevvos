from enum import StrEnum


class ServiceMode(StrEnum):
    ONLINE = "online"
    PRESENCIAL = "presencial"
    HIBRIDO = "hibrido"


class PhotoUsagePreference(StrEnum):
    FREQUENT = "frequent"
    OCCASIONAL = "occasional"
    AVOID = "avoid"
    UNKNOWN = "unknown"


class ContentFormat(StrEnum):
    STATIC_POST = "static_post"
    CAROUSEL = "carousel"
    STORY_SEQUENCE = "story_sequence"
    REEL_SCRIPT = "reel_script"
    LANDING_PAGE = "landing_page"
    LOGO = "logo"
    VISUAL_IDENTITY = "visual_identity"


class ContentObjective(StrEnum):
    AUTHORITY = "authority"
    ENGAGEMENT = "engagement"
    CONVERSION = "conversion"
    EDUCATION = "education"
    LEAD_GENERATION = "lead_generation"
    BRAND_AWARENESS = "brand_awareness"


class ContentRequestStatus(StrEnum):
    DRAFT = "draft"
    AWAITING_TEXT_APPROVAL = "awaiting_text_approval"
    TEXT_REVISION_REQUESTED = "text_revision_requested"
    TEXT_APPROVED = "text_approved"
    VISUAL_PROMPT_READY = "visual_prompt_ready"
    IN_MANUAL_PRODUCTION = "in_manual_production"
    AWAITING_FINAL_APPROVAL = "awaiting_final_approval"
    FINAL_REVISION_REQUESTED = "final_revision_requested"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"


class ContentDraftStatus(StrEnum):
    DRAFT = "draft"
    AWAITING_APPROVAL = "awaiting_approval"
    REVISION_REQUESTED = "revision_requested"
    APPROVED = "approved"


class ApprovalEventType(StrEnum):
    TEXT_SUBMITTED = "text_submitted"
    TEXT_REVISION_REQUESTED = "text_revision_requested"
    TEXT_APPROVED = "text_approved"
    STATUS_CHANGED = "status_changed"


class ApprovalActorType(StrEnum):
    ADMIN = "admin"
    CLIENT = "client"
    SYSTEM = "system"


class VisualTemplateCategory(StrEnum):
    INSTITUTIONAL_PREMIUM = "institutional_premium"
    TECHNICAL_EDITORIAL = "technical_editorial"
    HUMAN_CONNECTION = "human_connection"
    CONVERSION_FOCUSED = "conversion_focused"
    MINIMALIST_SCIENTIFIC = "minimalist_scientific"
    CUSTOM = "custom"


class RenderType(StrEnum):
    COVER_SLIDE = "cover_slide"
    CAROUSEL_SLIDE = "carousel_slide"
    CLOSING_SLIDE = "closing_slide"
    STATIC_POST = "static_post"
    STORY = "story"


class RenderSpecStatus(StrEnum):
    DRAFT = "draft"
    READY = "ready"
    RENDERED = "rendered"
    DISCARDED = "discarded"


class ImageRenderJobStatus(StrEnum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"


class CreativeAssetType(StrEnum):
    RENDERED_SLIDE = "rendered_slide"
    FINAL_DELIVERY = "final_delivery"
    REFERENCE = "reference"
    LOGO = "logo"
    PHOTO = "photo"


class CreativeAssetStatus(StrEnum):
    DRAFT = "draft"
    READY_FOR_REVIEW = "ready_for_review"
    APPROVED = "approved"
    REJECTED = "rejected"
    DISCARDED = "discarded"
