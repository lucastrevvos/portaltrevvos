import { AppWindow, Shield, ExternalLink } from "lucide-react";
import Link from "next/link";

type BetaAppCardProps = {
  name: string;
  summary: string;
  status?: "ALFA" | "BETA FECHADO" | "BETA ABERTO" | "LANÇADO";
  primaryCta: { label: string; href: string; aria?: string };
  secondaryCta?: { label: string; href: string; aria?: string };
  extra?: React.ReactNode; // chips, contador, etc.
  className?: string;
};

export function BetaAppCard({
  name,
  summary,
  status = "BETA FECHADO",
  primaryCta,
  secondaryCta,
  extra,
  className = "",
}: BetaAppCardProps) {
  const statusColors: Record<string, string> = {
    ALFA: "bg-red-100 text-red-800",
    "BETA FECHADO": "bg-amber-100 text-amber-800",
    "BETA ABERTO": "bg-emerald-100 text-emerald-800",
    LANÇADO: "bg-blue-100 text-blue-800",
  };

  return (
    <div
      className={`rounded-2xl border border-neutral-200 bg-white shadow-sm transition hover:shadow-md ${className}`}
    >
      {/* Header */}
      <div className="flex items-start gap-3 px-6 pt-5 pb-3">
        <AppWindow className="mt-0.5 h-5 w-5 text-emerald-700" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex h-5 items-center rounded px-2 text-[11px] font-semibold ${statusColors[status]}`}
            >
              {status}
            </span>
            {extra}
          </div>
          <h3 className="mt-2 text-lg font-semibold text-neutral-900">
            {name}
          </h3>
        </div>
      </div>

      {/* Body */}
      <div className="space-y-4 px-6 pb-6">
        <p className="text-sm leading-relaxed text-neutral-700">{summary}</p>

        {/* CTAs */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-start">
          <Link
            href={primaryCta.href}
            prefetch={false}
            aria-label={primaryCta.aria || primaryCta.label}
            className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            <Shield className="h-4 w-4" />
            {primaryCta.label}
          </Link>

          {secondaryCta && (
            <Link
              href={secondaryCta.href}
              prefetch={false}
              aria-label={secondaryCta.aria || secondaryCta.label}
              className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium border border-neutral-300 text-neutral-800 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              <ExternalLink className="h-4 w-4" />
              {secondaryCta.label}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
