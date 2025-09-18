import { Footer } from "../components/site/Footer";
import Header from "../components/site/Header";
import "./globals.css";

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-neutral-50 text-neutral-900">
        {/* Se quiser categorias dinâmicas aqui, dá pra tornar o layout async e buscar. */}
        <Header categories={[]} />
        {children}
        <Footer />
      </body>
    </html>
  );
}
