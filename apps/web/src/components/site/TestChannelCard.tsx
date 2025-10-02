import * as React from "react";
import Link from "next/link";
import { Megaphone, MessageCircle, Check } from "lucide-react";

// ------------------------------
// Card para a Home
// ------------------------------
export function TestChannelCard({
  whatsappUrl,
  className = "",
}: {
  whatsappUrl: string;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-emerald-200/60 bg-white shadow-sm ${className}`}
    >
      <div className="px-6 pt-5 pb-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-5 items-center rounded px-2 text-[11px] font-semibold text-white bg-emerald-600">
            OFICIAL
          </span>
          <span className="text-xs text-neutral-500">Canal de Testes</span>
        </div>
        <h3 className="mt-2 flex items-center gap-2 text-xl font-semibold">
          <Megaphone className="h-5 w-5" />
          Canal Oficial de Testes — Trevvos
        </h3>
      </div>

      <div className="space-y-4 px-6 pb-6">
        <p className="text-sm leading-relaxed text-neutral-700">
          Participe do nosso canal exclusivo no WhatsApp e receba primeiro as
          atualizações dos apps, convites para versões beta e tarefas de teste.
          Sua opinião ajuda a moldar o que vai para produção.
        </p>

        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 text-emerald-600" />
            Acesso antecipado às versões beta
          </li>
          <li className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 text-emerald-600" />
            Tarefas de teste e feedback direcionado
          </li>
          <li className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 text-emerald-600" />
            Destaques de changelog e roadmap
          </li>
        </ul>

        <div className="pt-1">
          <Link
            href={whatsappUrl}
            prefetch={false}
            aria-label="Entrar no Canal Oficial de Testes no WhatsApp"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            <MessageCircle className="h-4 w-4" />
            Entrar no Canal Oficial (WhatsApp)
          </Link>
          <p className="mt-2 text-center text-xs text-neutral-500">
            *Canal moderado. Sem spam. Convites para testes do KM One e futuros
            apps.
          </p>
        </div>
      </div>
    </div>
  );
}
