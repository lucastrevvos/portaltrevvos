import Link from "next/link";
import { FooterTestChannelBar } from "./FooterTestChannelBar";

export function Footer() {
  const WHATSAPP_URL =
    process.env.NEXT_PUBLIC_WHATSAPP_TESTS_URL ||
    "https://chat.whatsapp.com/K1cepLtEEoY6pScVRTNvg9";

  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/trevvos/logo.png"
              alt="Trevvos Soluções em IA"
              className="h-9 w-auto"
            />
          </Link>
          <p className="text-sm text-neutral-600">
            © {new Date().getFullYear()} Trevvos Soluções em IA. Posts,
            aplicações e produtos para uso real.
          </p>
        </div>

        <nav className="flex gap-4 text-sm text-neutral-600">
          <Link href="/politica" className="hover:text-neutral-900">
            Politica
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
