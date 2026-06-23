"use client";

import { useEffect } from "react";

type Props = {
  params: {
    token: string;
  };
};

export default function InvitePage({ params }: Props) {
  const token = params.token;

  useEffect(() => {
    if (!token) return;

    const deepLink = `todolistrevvos://todo/invite/${token}`;

    // tenta abrir o app
    window.location.href = deepLink;

    // mostra fallback depois de um tempo
    const timeout = setTimeout(() => {
      const fallback = document.getElementById("fallback");
      if (fallback) {
        fallback.style.display = "block";
      }
    }, 1500);

    return () => clearTimeout(timeout);
  }, [token]);

  return (
    <div
      style={{
        background: "#0D0D0D",
        color: "white",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        padding: 24,
        textAlign: "center",
      }}
    >
      <h2 style={{ marginBottom: 12 }}>Abrindo no app...</h2>

      <p style={{ color: "#D9D9D9", maxWidth: 360 }}>
        Estamos tentando abrir o convite no TodoList Trevvos.
      </p>

      <div id="fallback" style={{ display: "none", marginTop: 24 }}>
        <p>Se não abriu automaticamente:</p>

        <a
          href={`todolistrevvos://todo/invite/${token}`}
          style={{
            color: "#4EA8DE",
            display: "block",
            marginTop: 10,
            textDecoration: "none",
          }}
        >
          👉 Abrir no app
        </a>

        <a
          href="https://play.google.com/store/apps/details?id=com.lucasamaral.todolistrevvos"
          style={{
            color: "#4EA8DE",
            display: "block",
            marginTop: 10,
            textDecoration: "none",
          }}
        >
          📲 Baixar app
        </a>

        <p style={{ marginTop: 16, color: "#808080" }}>
          Token do convite:
          <br />
          <strong>{token}</strong>
        </p>
      </div>
    </div>
  );
}