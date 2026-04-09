import { useEffect } from "react";
import { useRouter } from "next/router";

export default function InvitePage() {
  const router = useRouter();
  const { token } = router.query;

  useEffect(() => {
    if (!token) return;

    const deepLink = `todolistrevvos://todo/invite/${token}`;

    // tenta abrir o app
    window.location.href = deepLink;

    // fallback depois de 1.5s
    const timeout = setTimeout(() => {
      document.getElementById("fallback")?.classList.remove("hidden");
    }, 1500);

    return () => clearTimeout(timeout);
  }, [token]);

  return (
    <div
      style={{
        background: "#0D0D0D",
        color: "white",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        padding: 24,
        textAlign: "center",
      }}
    >
      <h2>Abrindo no app...</h2>

      <div id="fallback" className="hidden" style={{ marginTop: 20 }}>
        <p>Se não abriu automaticamente:</p>

        <a
          href={`todolistrevvos://todo/invite/${token}`}
          style={{ color: "#4EA8DE", display: "block", marginTop: 10 }}
        >
          👉 Abrir no app
        </a>

        <a
          href="https://play.google.com/store/apps/details?id=com.lucasamaral.todolistrevvos"
          style={{ color: "#4EA8DE", display: "block", marginTop: 10 }}
        >
          📲 Baixar app
        </a>
      </div>
    </div>
  );
}