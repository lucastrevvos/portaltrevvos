import Link from "next/link";
import { ReactNode } from "react";

const STATUS_LABELS: Record<string, string> = {
  draft: "Rascunho",
  awaiting_text_approval: "Aguardando aprovação textual",
  text_revision_requested: "Revisão textual solicitada",
  text_approved: "Texto aprovado",
  visual_prompt_ready: "Especificações visuais prontas",
  in_manual_production: "Produção visual em andamento",
  awaiting_final_approval: "Aguardando aprovação final",
  final_revision_requested: "Revisão final solicitada",
  delivered: "Entregue",
  cancelled: "Cancelado",
  awaiting_approval: "Aguardando aprovação",
  revision_requested: "Revisão solicitada",
  approved: "Aprovado",
  ready: "Pronto",
  rendered: "Renderizado",
  ready_for_review: "Pronto para revisão",
  discarded: "Descartado",
};

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-white text-[color:var(--ink-soft)] border-[color:var(--border)]",
  awaiting_text_approval: "bg-amber-50 text-amber-700 border-amber-200",
  text_revision_requested: "bg-rose-50 text-rose-700 border-rose-200",
  text_approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  visual_prompt_ready: "bg-sky-50 text-sky-700 border-sky-200",
  in_manual_production: "bg-violet-50 text-violet-700 border-violet-200",
  awaiting_final_approval: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
  final_revision_requested: "bg-orange-50 text-orange-700 border-orange-200",
  delivered: "bg-zinc-900 text-white border-zinc-900",
  cancelled: "bg-zinc-200 text-zinc-700 border-zinc-300",
  awaiting_approval: "bg-amber-50 text-amber-700 border-amber-200",
  revision_requested: "bg-rose-50 text-rose-700 border-rose-200",
  approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  ready: "bg-sky-50 text-sky-700 border-sky-200",
  rendered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  ready_for_review: "bg-violet-50 text-violet-700 border-violet-200",
  discarded: "bg-zinc-100 text-zinc-500 border-zinc-200",
};

const EVENT_LABELS: Record<string, string> = {
  text_submitted: "Texto submetido",
  text_revision_requested: "Revisão textual solicitada",
  text_approved: "Texto aprovado",
  status_changed: "Status alterado",
};

const EVENT_STYLES: Record<string, string> = {
  text_submitted: "bg-sky-50 text-sky-700 border-sky-200",
  text_revision_requested: "bg-rose-50 text-rose-700 border-rose-200",
  text_approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  status_changed: "bg-zinc-100 text-zinc-700 border-zinc-200",
};

const BRAND_ASSET_LABELS: Record<string, string> = {
  logo: "Logo",
  profile_photo: "Foto principal",
  brand_reference: "Referência da marca",
  post_reference: "Referência de post",
  product_photo: "Foto de produto",
  general_asset: "Asset geral",
};

export const REQUEST_FLOW = [
  "draft",
  "awaiting_text_approval",
  "text_approved",
  "visual_prompt_ready",
  "in_manual_production",
  "awaiting_final_approval",
  "delivered",
];

export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function formatStatus(value: string) {
  return STATUS_LABELS[value] ?? value.replaceAll("_", " ");
}

export function formatEventType(value: string) {
  return EVENT_LABELS[value] ?? value.replaceAll("_", " ");
}

export function formatBrandAssetType(value: string) {
  return BRAND_ASSET_LABELS[value] ?? value.replaceAll("_", " ");
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function statusTone(value: string) {
  return (
    STATUS_STYLES[value] ??
    "bg-white text-[color:var(--ink-soft)] border-[color:var(--border)]"
  );
}

export function eventTone(value: string) {
  return (
    EVENT_STYLES[value] ??
    "bg-white text-[color:var(--ink-soft)] border-[color:var(--border)]"
  );
}

export function PageShell({
  title,
  eyebrow,
  description,
  actions,
  children,
}: {
  title: string;
  eyebrow?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--card-strong)] p-6 shadow-[0_24px_64px_rgba(24,24,27,0.08)] backdrop-blur sm:p-8">
      <header className="flex flex-col gap-4 border-b border-[color:var(--border)] pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          {eyebrow ? (
            <p className="text-sm uppercase tracking-[0.16em] text-[color:var(--muted)]">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl leading-tight">
            {title}
          </h1>
          {description ? (
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[color:var(--muted)]">
              {description}
            </p>
          ) : null}
        </div>
        {actions}
      </header>
      <div className="mt-8">{children}</div>
    </section>
  );
}

export function SidebarLink({
  href,
  label,
  active,
}: {
  href: string;
  label: ReactNode;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-2xl px-4 py-3 text-sm transition",
        active
          ? "bg-[color:var(--foreground)] text-white"
          : "border border-[color:var(--border)] bg-white/60 text-[color:var(--ink-soft)] hover:-translate-y-0.5 hover:bg-white/80",
      )}
    >
      {label}
    </Link>
  );
}

export function SurfaceCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "rounded-[1.75rem] border border-[color:var(--border)] bg-white/75 p-5",
        className,
      )}
    >
      {children}
    </article>
  );
}

export function MetricCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <SurfaceCard>
      <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]">
        {label}
      </p>
      <p className="mt-4 font-[family-name:var(--font-display)] text-5xl leading-none">
        {value}
      </p>
      {hint ? (
        <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">{hint}</p>
      ) : null}
    </SurfaceCard>
  );
}

export function StatusBadge({ value }: { value: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold",
        statusTone(value),
      )}
    >
      {formatStatus(value)}
    </span>
  );
}

export function EventBadge({ value }: { value: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold",
        eventTone(value),
      )}
    >
      {formatEventType(value)}
    </span>
  );
}

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <SurfaceCard className="border-dashed bg-white/50 text-center">
      <h2 className="text-lg font-semibold text-[color:var(--foreground)]">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
        {description}
      </p>
    </SurfaceCard>
  );
}

export function ErrorState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <SurfaceCard className="border-rose-200 bg-rose-50/80">
      <h2 className="text-lg font-semibold text-rose-800">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-rose-700">{description}</p>
    </SurfaceCard>
  );
}

export function SuccessState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <SurfaceCard className="border-emerald-200 bg-emerald-50/80">
      <h2 className="text-lg font-semibold text-emerald-800">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-emerald-700">{description}</p>
    </SurfaceCard>
  );
}

export function KeyValue({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]">
        {label}
      </p>
      <div className="mt-2 text-sm leading-7 text-[color:var(--ink-soft)]">{value}</div>
    </div>
  );
}
