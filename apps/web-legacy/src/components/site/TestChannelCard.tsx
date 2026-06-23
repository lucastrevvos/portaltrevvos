import * as React from "react";
import Link from "next/link";
import { Check, Megaphone, MessageCircle } from "lucide-react";

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
      <div className="px-6 pb-3 pt-5">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-5 items-center rounded bg-emerald-600 px-2 text-[11px] font-semibold text-white">
            OFICIAL
          </span>
          <span className="text-xs text-neutral-500">Canal de lancamentos</span>
        </div>
        <h3 className="mt-2 flex items-center gap-2 text-xl font-semibold">
          <Megaphone className="h-5 w-5" />
          Canal oficial da Trevvos
        </h3>
      </div>

      <div className="space-y-4 px-6 pb-6">
        <p className="text-sm leading-relaxed text-neutral-700">
          Entre para acompanhar novos posts sobre IA, convites para testes e as
          atualizacoes dos produtos que estamos colocando na rua.
        </p>

        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 text-emerald-600" />
            Acesso antecipado a testes e validacoes
          </li>
          <li className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 text-emerald-600" />
            Conteudo novo ligado a IA aplicada
          </li>
          <li className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 text-emerald-600" />
            Destaques de roadmap, lancamentos e betas
          </li>
        </ul>

        <div className="pt-1">
          <Link
            href={whatsappUrl}
            prefetch={false}
            aria-label="Entrar no canal oficial da Trevvos no WhatsApp"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 hover:bg-emerald-700"
          >
            <MessageCircle className="h-4 w-4" />
            Entrar no canal oficial
          </Link>
          <p className="mt-2 text-center text-xs text-neutral-500">
            Canal moderado. Sem spam. Atualizacoes sobre conteudo, pilotos e
            futuros produtos.
          </p>
        </div>
      </div>
    </div>
  );
}
