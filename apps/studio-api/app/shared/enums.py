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
