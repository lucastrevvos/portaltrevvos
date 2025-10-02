// ------------------------------
// Barra/CTA para o Footer

import { Megaphone, MessageCircle } from "lucide-react";
import Link from "next/link";

// ------------------------------
export function FooterTestChannelBar({
  whatsappUrl,
  className = "",
}: {
  whatsappUrl: string;
  className?: string;
}) {
  return (
    <div
      className={`mt-8 rounded-xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50 to-white p-4 sm:flex sm:items-center sm:justify-between ${className}`}
      role="complementary"
      aria-label="Convite para o Canal Oficial de Testes"
    >
      <div className="mb-3 flex items-start gap-2 sm:mb-0">
        <Megaphone className="mt-0.5 h-5 w-5 text-emerald-700" />
        <div>
          <p className="text-sm font-medium text-emerald-800">
            Canal Oficial de Testes no WhatsApp
          </p>
          <p className="text-xs text-neutral-600">
            Receba convites de beta e novidades primeiro.
          </p>
        </div>
      </div>

      <Link
        href={whatsappUrl}
        prefetch={false}
        aria-label="Abrir Canal Oficial de Testes no WhatsApp"
        className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
      >
        <MessageCircle className="h-4 w-4" />
        Entrar no Canal
      </Link>
    </div>
  );
}
