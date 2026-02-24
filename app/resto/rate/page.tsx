"use client";

import { useState } from "react";
import { getSession, clearSession } from "@/lib/restoSession";
import { useRouter } from "next/navigation";
import Image from "next/image";

const aspects = [
  { id: "comida", label: "Comida", icon: "🍽️" },
  { id: "servicio", label: "Servicio", icon: "👨‍🍳" },
  { id: "ambiente", label: "Ambiente", icon: "✨" },
  { id: "velocidad", label: "Velocidad", icon: "⚡" },
];

export default function RatePage() {
  const [stars, setStars] = useState(5);
  const [comment, setComment] = useState("");
  const [aspectRatings, setAspectRatings] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const router = useRouter();

  async function submit() {
    const s = getSession();
    if (!s?.orderId) return;
    setSubmitting(true);

    await fetch(`/api/resto/rate/${s.orderId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stars, comment }),
    });

    await fetch(`/api/resto/orders/${s.orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "close" }),
    });

    setDone(true);
    setTimeout(() => {
      clearSession();
      router.push("/resto");
    }, 3000);
  }

  if (done) return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center gap-5 text-center">
      <div className="text-7xl">🙌</div>
      <div className="text-3xl font-extrabold">¡Gracias!</div>
      <div className="text-white/60 max-w-sm">Tu opinión ayuda a mejorar la experiencia para todos nuestros comensales.</div>
      <div className="flex">
        {Array.from({ length: stars }).map((_, i) => (
          <span key={i} className="text-3xl">⭐</span>
        ))}
      </div>
      <div className="text-sm text-white/30 mt-2">Regresando al inicio…</div>
    </div>
  );

  return (
    <div className="space-y-5 max-w-md mx-auto">
      {/* Header */}
      <div className="rounded-[28px] p-6 text-center"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(0,201,184,0.1)" }}>
        <div className="text-4xl mb-3">⭐</div>
        <div className="text-2xl font-bold">Califica tu experiencia</div>
        <div className="text-sm text-white/50 mt-1">Tarda menos de 30 segundos</div>
      </div>

      {/* Overall stars */}
      <div className="rounded-[22px] p-5"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="font-semibold mb-4 text-center">¿Cómo fue tu experiencia general?</div>
        <div className="flex items-center justify-center gap-3">
          {[1, 2, 3, 4, 5].map((s) => (
            <button key={s} onClick={() => setStars(s)}
              className="text-4xl transition-transform hover:scale-110 active:scale-95"
              style={{ filter: s <= stars ? "none" : "grayscale(1) opacity(0.3)" }}>
              ⭐
            </button>
          ))}
        </div>
        <div className="text-center mt-3 font-bold" style={{ color: "#00C9B8" }}>
          {["", "Muy malo", "Malo", "Regular", "Bueno", "Excelente"][stars]}
        </div>
      </div>

      {/* Aspect ratings */}
      <div className="grid grid-cols-2 gap-3">
        {aspects.map((a) => {
          const r = aspectRatings[a.id] || 0;
          return (
            <div key={a.id} className="rounded-[18px] p-4"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="text-lg mb-1">{a.icon}</div>
              <div className="text-xs text-white/60 mb-2">{a.label}</div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={s} onClick={() => setAspectRatings(prev => ({ ...prev, [a.id]: s }))}
                    className="text-sm transition"
                    style={{ filter: s <= r ? "none" : "grayscale(1) opacity(0.25)" }}>⭐</button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Comment */}
      <div className="rounded-[22px] p-5"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="font-semibold mb-3">Comentario (opcional)</div>
        <textarea
          className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none"
          style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(0,201,184,0.15)", color: "white", minHeight: "80px" }}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="¿Qué te gustó? ¿Qué podríamos mejorar?"
        />
      </div>

      <button onClick={submit} disabled={submitting}
        className="w-full py-4 rounded-2xl font-bold text-base transition hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
        style={{ background: "linear-gradient(135deg, #00C9B8, #0A6EBD)", color: "#000", boxShadow: "0 0 24px rgba(0,201,184,0.25)" }}>
        {submitting ? "Enviando…" : "🚀 Enviar y cerrar cuenta"}
      </button>
    </div>
  );
}
