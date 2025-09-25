import { Footer } from "../components/site/Footer";
import Header from "../components/site/Header";
import "./globals.css";

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  title: { default: "Trevvos", template: "%s — Trevvos" },
  description: "Conteúdo + Apps que fazem sentido.",
  alternates: { canonical: "/" },
  openGraph: { siteName: "Trevvos" },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/icon-192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="512x512"
          href="/icon-512.png"
        />
      </head>
      <body className="bg-neutral-50 text-neutral-900">
        <Header categories={[]} />
        {children}
        <Footer />
      </body>
    </html>
  );
}
