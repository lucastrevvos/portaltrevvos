"use client";

import { useState } from "react";
import { apiFetch } from "../../lib/api";

export function NewsletterCard() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      await apiFetch("/newsletter/subscribe", {
        method: "POST",
        body: { email },
      });

      setStatus("success");
      setEmail("");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  return (
    <div className="rounded-2xl border border-neutral-200 bg-gradient-to-br from-emerald-600 to-emerald-700 p-5 text-white shadow-sm">
      <h3 className="text-sm font-semibold">Assine a newsletter</h3>
      <p className="mt-1 text-sm/5 text-emerald-50">
        Receba 1 email semanal com notícias e apps novos.
      </p>
      <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          name="email"
          type="email"
          placeholder="seu@email.com"
          required
          className="h-9 w-full rounded-xl border border-white/20 bg-white/10 px-3 text-sm placeholder:text-emerald-100 outline-none focus:bg-white/20"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="h-9 shrink-0 rounded-xl bg-white px-3 text-sm font-medium text-emerald-700 hover:bg-emerald-50 disabled:opacity-50"
        >
          {status === "loading" ? "..." : "Assinar"}
        </button>
      </form>
      {status === "success" && (
        <p className="mt-2 text-xs text-emerald-100">
          ✅ Inscrição feita com sucesso!
        </p>
      )}
      {status === "error" && (
        <p className="mt-2 text-xs text-red-200">
          ❌ Erro ao se inscrever, tente novamente.
        </p>
      )}
    </div>
  );
}
