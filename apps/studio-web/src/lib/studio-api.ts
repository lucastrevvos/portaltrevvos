export const SERVICE_MODE_OPTIONS = [
  "online",
  "presencial",
  "hibrido",
] as const;

export const PHOTO_USAGE_OPTIONS = [
  "frequent",
  "occasional",
  "avoid",
  "unknown",
] as const;

export const CONTENT_FORMAT_OPTIONS = [
  "static_post",
  "carousel",
  "story_sequence",
  "reel_script",
  "landing_page",
  "logo",
  "visual_identity",
] as const;

export const CONTENT_OBJECTIVE_OPTIONS = [
  "authority",
  "engagement",
  "conversion",
  "education",
  "lead_generation",
  "brand_awareness",
] as const;

export const VISUAL_TEMPLATE_CATEGORY_OPTIONS = [
  "institutional_premium",
  "technical_editorial",
  "human_connection",
  "conversion_focused",
  "minimalist_scientific",
  "custom",
] as const;

export type ServiceMode = (typeof SERVICE_MODE_OPTIONS)[number];
export type PhotoUsagePreference = (typeof PHOTO_USAGE_OPTIONS)[number];
export type ContentFormat = (typeof CONTENT_FORMAT_OPTIONS)[number];
export type ContentObjective = (typeof CONTENT_OBJECTIVE_OPTIONS)[number];
export type VisualTemplateCategory =
  (typeof VISUAL_TEMPLATE_CATEGORY_OPTIONS)[number];

export type Tenant = {
  id: string;
  name: string;
  slug: string;
  business_name: string | null;
  niche: string;
  created_at: string;
  updated_at: string;
};

export type TenantPayload = {
  name: string;
  slug: string;
  business_name: string | null;
  niche: string;
};

export type OnboardingProfile = {
  id: string;
  tenant_id: string;
  professional_name: string;
  instagram_handle: string | null;
  website_url: string | null;
  whatsapp_number: string | null;
  city: string | null;
  service_mode: ServiceMode;
  target_audience: string;
  audience_pain_points: string;
  main_services: string;
  desired_positioning: string;
  tone_of_voice: string;
  avoid_communication: string | null;
  brand_phrase: string | null;
  main_cta: string | null;
  created_at: string;
  updated_at: string;
};

export type OnboardingPayload = {
  professional_name: string;
  instagram_handle: string | null;
  website_url: string | null;
  whatsapp_number: string | null;
  city: string | null;
  service_mode: ServiceMode;
  target_audience: string;
  audience_pain_points: string;
  main_services: string;
  desired_positioning: string;
  tone_of_voice: string;
  avoid_communication: string | null;
  brand_phrase: string | null;
  main_cta: string | null;
};

export type BrandKit = {
  id: string;
  tenant_id: string;
  logo_url: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  accent_color: string | null;
  font_preferences: string | null;
  visual_style: string | null;
  photo_usage_preference: PhotoUsagePreference;
  layout_preference: string | null;
  created_at: string;
  updated_at: string;
};

export type BrandKitPayload = {
  logo_url: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  accent_color: string | null;
  font_preferences: string | null;
  visual_style: string | null;
  photo_usage_preference: PhotoUsagePreference;
  layout_preference: string | null;
};

export type ContentRequest = {
  id: string;
  tenant_id: string;
  title: string;
  format: ContentFormat;
  objective: ContentObjective;
  cta: string | null;
  theme: string;
  visual_template_id: string | null;
  status: string;
  briefing: string | null;
  created_at: string;
  updated_at: string;
};

export type ContentRequestPayload = {
  title: string;
  format: ContentFormat;
  objective: ContentObjective;
  cta: string | null;
  theme: string;
  briefing: string | null;
};

export type CarouselSlide = {
  id: string;
  tenant_id: string;
  content_draft_id: string;
  slide_number: number;
  title: string;
  body: string | null;
  visual_notes: string | null;
  created_at: string;
  updated_at: string;
};

export type CarouselSlidePayload = {
  slide_number: number;
  title: string;
  body: string | null;
  visual_notes: string | null;
};

export type ContentDraft = {
  id: string;
  tenant_id: string;
  content_request_id: string;
  title: string;
  caption: string | null;
  fixed_comment: string | null;
  stories_suggestion: string | null;
  status: string;
  version: number;
  slides: CarouselSlide[];
  created_at: string;
  updated_at: string;
};

export type ContentDraftPayload = {
  title: string;
  caption: string | null;
  fixed_comment: string | null;
  stories_suggestion: string | null;
  slides: CarouselSlidePayload[];
};

export type RenderSpec = {
  id: string;
  tenant_id: string;
  content_request_id: string;
  content_draft_id: string;
  carousel_slide_id: string | null;
  visual_template_id: string;
  render_type: string;
  slide_number: number | null;
  total_slides: number | null;
  width: number;
  height: number;
  title: string;
  body: string | null;
  cta: string | null;
  visual_notes: string | null;
  brand_logo_url: string | null;
  brand_primary_color: string | null;
  brand_secondary_color: string | null;
  brand_accent_color: string | null;
  brand_visual_style: string | null;
  photo_url: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};

export type CreativeAsset = {
  id: string;
  tenant_id: string;
  content_request_id: string;
  render_spec_id: string | null;
  image_render_job_id: string | null;
  asset_type: string;
  url: string;
  file_name: string;
  mime_type: string;
  width: number | null;
  height: number | null;
  status: string;
  created_at: string;
  updated_at: string;
};

export type VisualTemplateTheme = {
  background?: string;
  primary?: string;
  secondary?: string;
  accent?: string;
  titleFont?: string;
  bodyFont?: string;
};

export type VisualTemplate = {
  id: string;
  tenant_id: string | null;
  name: string;
  description: string | null;
  category: VisualTemplateCategory;
  layout_rules: string;
  css_theme: Record<string, unknown>;
  default_aspect_ratio: string;
  width: number;
  height: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type VisualTemplatePayload = {
  name: string;
  description: string | null;
  category: VisualTemplateCategory;
  layout_rules: string;
  css_theme: VisualTemplateTheme;
  default_aspect_ratio: string;
  width: number;
  height: number;
  is_active: boolean;
};

export type RenderSpecGenerationResponse = {
  content_request_id: string;
  status: string;
  render_specs: RenderSpec[];
};

export type RenderExecutionResponse = {
  content_request_id: string;
  status: string;
  assets: CreativeAsset[];
};

export type WorkflowActionPayload = {
  actor_type: "admin" | "client";
  actor_name: string;
  comment: string | null;
};

export class StudioApiError extends Error {
  status: number;
  detail: string;

  constructor(status: number, detail: string) {
    super(detail);
    this.name = "StudioApiError";
    this.status = status;
    this.detail = detail;
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH";
  body?: unknown;
  allowNotFound?: boolean;
};

function getBaseUrl() {
  const baseUrl = process.env.NEXT_PUBLIC_STUDIO_API_URL;
  if (!baseUrl) {
    throw new Error(
      "NEXT_PUBLIC_STUDIO_API_URL is not configured for the Studio dashboard.",
    );
  }
  return baseUrl.replace(/\/+$/, "");
}

function cleanOptionalText(value: string | null | undefined) {
  const cleaned = value?.trim();
  return cleaned ? cleaned : null;
}

export function getAssetUrl(path: string) {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return `${getBaseUrl()}${path}`;
}

export function defaultTechnicalEditorialTemplate(): VisualTemplatePayload {
  return {
    name: "Técnico Editorial",
    description: "Template editorial clean para carrosséis educativos.",
    category: "technical_editorial",
    layout_rules:
      "Fundo off-white, títulos grandes, blocos de texto com respiro, logo no topo e rodapé discreto.",
    css_theme: {
      background: "#F7F2EA",
      primary: "#506044",
      secondary: "#E7DDCF",
      accent: "#B5895A",
      titleFont: "Georgia",
      bodyFont: "Arial",
    },
    default_aspect_ratio: "1:1",
    width: 1080,
    height: 1080,
    is_active: true,
  };
}

async function parseError(response: Response) {
  try {
    const payload = (await response.json()) as { detail?: string };
    return payload.detail || `Studio API request failed with status ${response.status}.`;
  } catch {
    return `Studio API request failed with status ${response.status}.`;
  }
}

async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T | null> {
  const response = await fetch(`${getBaseUrl()}${path}`, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
  });

  if (options.allowNotFound && response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new StudioApiError(response.status, await parseError(response));
  }

  return (await response.json()) as T;
}

export async function getTenants() {
  return (await request<Tenant[]>("/tenants")) ?? [];
}

export async function getTenant(tenantId: string) {
  return (await request<Tenant>(`/tenants/${tenantId}`)) as Tenant;
}

export async function createTenant(payload: TenantPayload) {
  return (await request<Tenant>("/tenants", {
    method: "POST",
    body: {
      ...payload,
      business_name: cleanOptionalText(payload.business_name),
    },
  })) as Tenant;
}

export async function getTenantOnboarding(tenantId: string) {
  return await request<OnboardingProfile>(`/tenants/${tenantId}/onboarding`, {
    allowNotFound: true,
  });
}

export async function createOnboarding(
  tenantId: string,
  payload: OnboardingPayload,
) {
  return (await request<OnboardingProfile>(`/tenants/${tenantId}/onboarding`, {
    method: "POST",
    body: {
      ...payload,
      instagram_handle: cleanOptionalText(payload.instagram_handle),
      website_url: cleanOptionalText(payload.website_url),
      whatsapp_number: cleanOptionalText(payload.whatsapp_number),
      city: cleanOptionalText(payload.city),
      avoid_communication: cleanOptionalText(payload.avoid_communication),
      brand_phrase: cleanOptionalText(payload.brand_phrase),
      main_cta: cleanOptionalText(payload.main_cta),
    },
  })) as OnboardingProfile;
}

export async function updateOnboarding(
  tenantId: string,
  payload: OnboardingPayload,
) {
  return (await request<OnboardingProfile>(`/tenants/${tenantId}/onboarding`, {
    method: "PUT",
    body: {
      ...payload,
      instagram_handle: cleanOptionalText(payload.instagram_handle),
      website_url: cleanOptionalText(payload.website_url),
      whatsapp_number: cleanOptionalText(payload.whatsapp_number),
      city: cleanOptionalText(payload.city),
      avoid_communication: cleanOptionalText(payload.avoid_communication),
      brand_phrase: cleanOptionalText(payload.brand_phrase),
      main_cta: cleanOptionalText(payload.main_cta),
    },
  })) as OnboardingProfile;
}

export async function getTenantBrandKit(tenantId: string) {
  return await request<BrandKit>(`/tenants/${tenantId}/brand-kit`, {
    allowNotFound: true,
  });
}

export async function createBrandKit(tenantId: string, payload: BrandKitPayload) {
  return (await request<BrandKit>(`/tenants/${tenantId}/brand-kit`, {
    method: "POST",
    body: {
      ...payload,
      logo_url: cleanOptionalText(payload.logo_url),
      primary_color: cleanOptionalText(payload.primary_color),
      secondary_color: cleanOptionalText(payload.secondary_color),
      accent_color: cleanOptionalText(payload.accent_color),
      font_preferences: cleanOptionalText(payload.font_preferences),
      visual_style: cleanOptionalText(payload.visual_style),
      layout_preference: cleanOptionalText(payload.layout_preference),
    },
  })) as BrandKit;
}

export async function updateBrandKit(tenantId: string, payload: BrandKitPayload) {
  return (await request<BrandKit>(`/tenants/${tenantId}/brand-kit`, {
    method: "PUT",
    body: {
      ...payload,
      logo_url: cleanOptionalText(payload.logo_url),
      primary_color: cleanOptionalText(payload.primary_color),
      secondary_color: cleanOptionalText(payload.secondary_color),
      accent_color: cleanOptionalText(payload.accent_color),
      font_preferences: cleanOptionalText(payload.font_preferences),
      visual_style: cleanOptionalText(payload.visual_style),
      layout_preference: cleanOptionalText(payload.layout_preference),
    },
  })) as BrandKit;
}

export async function getContentRequests(tenantId: string) {
  return (await request<ContentRequest[]>(
    `/tenants/${tenantId}/content-requests`,
  )) ?? [];
}

export async function getContentRequest(tenantId: string, requestId: string) {
  return (await request<ContentRequest>(
    `/tenants/${tenantId}/content-requests/${requestId}`,
  )) as ContentRequest;
}

export async function createContentRequest(
  tenantId: string,
  payload: ContentRequestPayload,
) {
  return (await request<ContentRequest>(
    `/tenants/${tenantId}/content-requests`,
    {
      method: "POST",
      body: {
        ...payload,
        cta: cleanOptionalText(payload.cta),
        briefing: cleanOptionalText(payload.briefing),
      },
    },
  )) as ContentRequest;
}

export async function getContentDraft(tenantId: string, requestId: string) {
  return await request<ContentDraft>(
    `/tenants/${tenantId}/content-requests/${requestId}/draft`,
    { allowNotFound: true },
  );
}

export async function createContentDraft(
  tenantId: string,
  requestId: string,
  payload: ContentDraftPayload,
) {
  return (await request<ContentDraft>(
    `/tenants/${tenantId}/content-requests/${requestId}/draft`,
    {
      method: "POST",
      body: {
        ...payload,
        caption: cleanOptionalText(payload.caption),
        fixed_comment: cleanOptionalText(payload.fixed_comment),
        stories_suggestion: cleanOptionalText(payload.stories_suggestion),
        slides: payload.slides.map((slide) => ({
          ...slide,
          body: cleanOptionalText(slide.body),
          visual_notes: cleanOptionalText(slide.visual_notes),
        })),
      },
    },
  )) as ContentDraft;
}

export async function updateContentDraft(
  tenantId: string,
  requestId: string,
  payload: ContentDraftPayload,
) {
  return (await request<ContentDraft>(
    `/tenants/${tenantId}/content-requests/${requestId}/draft`,
    {
      method: "PUT",
      body: {
        ...payload,
        caption: cleanOptionalText(payload.caption),
        fixed_comment: cleanOptionalText(payload.fixed_comment),
        stories_suggestion: cleanOptionalText(payload.stories_suggestion),
        slides: payload.slides.map((slide) => ({
          ...slide,
          body: cleanOptionalText(slide.body),
          visual_notes: cleanOptionalText(slide.visual_notes),
        })),
      },
    },
  )) as ContentDraft;
}

export async function submitContentDraft(
  tenantId: string,
  requestId: string,
  payload: WorkflowActionPayload,
) {
  return (await request<ContentDraft>(
    `/tenants/${tenantId}/content-requests/${requestId}/draft/submit`,
    {
      method: "POST",
      body: {
        ...payload,
        comment: cleanOptionalText(payload.comment),
      },
    },
  )) as ContentDraft;
}

export async function approveContentDraft(
  tenantId: string,
  requestId: string,
  payload: WorkflowActionPayload,
) {
  return (await request<ContentDraft>(
    `/tenants/${tenantId}/content-requests/${requestId}/draft/approve`,
    {
      method: "POST",
      body: {
        ...payload,
        comment: cleanOptionalText(payload.comment),
      },
    },
  )) as ContentDraft;
}

export async function getRenderSpecs(tenantId: string, requestId: string) {
  return (await request<RenderSpec[]>(
    `/tenants/${tenantId}/content-requests/${requestId}/render-specs`,
  )) ?? [];
}

export async function generateRenderSpecs(
  tenantId: string,
  requestId: string,
  visualTemplateId: string,
) {
  return (await request<RenderSpecGenerationResponse>(
    `/tenants/${tenantId}/content-requests/${requestId}/render-specs/generate`,
    {
      method: "POST",
      body: {
        visual_template_id: visualTemplateId,
        actor_type: "admin",
        actor_name: "Admin Studio",
        comment: "Render specs geradas pela interface.",
      },
    },
  )) as RenderSpecGenerationResponse;
}

export async function renderContentRequest(tenantId: string, requestId: string) {
  return (await request<RenderExecutionResponse>(
    `/tenants/${tenantId}/content-requests/${requestId}/render`,
    {
      method: "POST",
      body: {
        actor_type: "admin",
        actor_name: "Admin Studio",
        comment: "Render visual iniciado pela interface.",
      },
    },
  )) as RenderExecutionResponse;
}

export async function getCreativeAssets(tenantId: string, requestId: string) {
  return (await request<CreativeAsset[]>(
    `/tenants/${tenantId}/content-requests/${requestId}/creative-assets`,
  )) ?? [];
}

export async function getVisualTemplates(tenantId: string) {
  return (await request<VisualTemplate[]>(
    `/tenants/${tenantId}/visual-templates`,
  )) ?? [];
}

export async function createVisualTemplate(
  tenantId: string,
  payload: VisualTemplatePayload,
) {
  return (await request<VisualTemplate>(`/tenants/${tenantId}/visual-templates`, {
    method: "POST",
    body: {
      ...payload,
      description: cleanOptionalText(payload.description),
    },
  })) as VisualTemplate;
}
