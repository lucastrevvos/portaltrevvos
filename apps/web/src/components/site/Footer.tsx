import Link from "next/link";
import { FooterTestChannelBar } from "./FooterTestChannelBar";

export function Footer() {
  const WHATSAPP_URL =
    process.env.NEXT_PUBLIC_WHATSAPP_TESTS_URL ||
    "https://chat.whatsapp.com/K1cepLtEEoY6pScVRTNvg9";

  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/trevvos/logo.png" alt="Trevvos" className="h-9 w-auto" />
          </Link>
          <p className="text-sm text-neutral-600">
            © {new Date().getFullYear()} Trevvos. Conteúdo + Apps que fazem
            sentido.
          </p>
        </div>

        <nav className="text-sm text-neutral-600 flex gap-4">
          <Link href="/politica" className="hover:text-neutral-900">
            Política
          </Link>
          <Link href="/termos" className="hover:text-neutral-900">
            Termos
          </Link>
          <Link href="/contato" className="hover:text-neutral-900">
            Contato
          </Link>
        </nav>
        <FooterTestChannelBar whatsappUrl={WHATSAPP_URL} />
      </div>
    </footer>
  );
}
