"use client";

import Image from "next/image";
import { setSession } from "@/lib/restoSession";
import { useRouter } from "next/navigation";
import { useState } from "react";

const demoTables = ["T1", "T5", "T12", "VIP1", "VIP7", "BAR3", "TERRAZA2"];

export default function RestoEntry() {
  const [tableCode, setTableCode] = useState("T12");
  const [customerName, setCustomerName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function enter() {
    if (!tableCode.trim()) return;
    setLoading(true);
    const r = await fetch("/api/resto/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tableCode: tableCode.trim().toUpperCase(), customerName }),
    });
    const data = await r.json();
    setSession({ tableCode: tableCode.trim().toUpperCase(), customerName, orderId: data.order.id });
    router.push("/resto/menu");
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex flex-col items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 blur-xl rounded-full scale-110" style={{ background: "rgba(0,201,184,0.25)" }} />
              <Image src="/logo.png" alt="DinerFlow" width={80} height={80} className="relative rounded-full shadow-2xl" />
            </div>
            <div>
              <div className="text-2xl font-extrabold">
                <span style={{ background: "linear-gradient(135deg, #00C9B8, #0A6EBD)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>DinerFlow</span>
                <span className="text-white"> AI</span>
              </div>
              <div className="text-xs text-white/40">Smart Dining. Seamless Service.</div>
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-[28px] p-6 shadow-2xl"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(0,201,184,0.12)", backdropFilter: "blur(20px)" }}>

          <div className="text-center mb-6">
            <div className="text-xl font-bold">Bienvenido 👋</div>
            <div className="text-sm text-white/50 mt-1">Ingresa el código de tu mesa para comenzar</div>
          </div>

          <div className="space-y-4">
            {/* Table code */}
            <div>
              <label className="text-xs text-white/50 font-mono uppercase tracking-wider mb-2 block">Código de mesa</label>
              <input
                className="w-full rounded-xl px-4 py-3 text-lg font-bold text-center outline-none transition"
                style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(0,201,184,0.2)", color: "white", letterSpacing: "0.1em" }}
                value={tableCode}
                onChange={(e) => setTableCode(e.target.value.toUpperCase())}
                placeholder="Ej: T12"
              />
            </div>

            {/* Quick table buttons */}
            <div>
              <div className="text-xs text-white/30 mb-2 font-mono">Demo rápido:</div>
              <div className="flex flex-wrap gap-1.5">
                {demoTables.map((t) => (
                  <button key={t} onClick={() => setTableCode(t)}
                    className="px-2.5 py-1 rounded-lg text-xs font-mono transition"
                    style={{
                      background: tableCode === t ? "rgba(0,201,184,0.2)" : "rgba(255,255,255,0.04)",
                      border: tableCode === t ? "1px solid rgba(0,201,184,0.4)" : "1px solid rgba(255,255,255,0.08)",
                      color: tableCode === t ? "#00C9B8" : "rgba(255,255,255,0.5)",
                    }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Name (optional) */}
            <div>
              <label className="text-xs text-white/50 font-mono uppercase tracking-wider mb-2 block">Tu nombre (opcional)</label>
              <input
                className="w-full rounded-xl px-4 py-3 text-sm outline-none transition"
                style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.08)", color: "white" }}
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Ej: Carlos"
              />
            </div>

            <button onClick={enter} disabled={loading || !tableCode.trim()}
              className="w-full py-4 rounded-xl font-bold text-sm transition hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
              style={{ background: "linear-gradient(135deg, #00C9B8, #0A6EBD)", color: "#000", boxShadow: "0 0 24px rgba(0,201,184,0.25)" }}>
              {loading ? (
                <><span className="size-4 rounded-full border-2 border-black/20 border-t-black animate-spin" />Cargando…</>
              ) : (
                <>🍽️ Ver el menú →</>
              )}
            </button>
          </div>
        </div>

        <div className="text-center mt-4 text-xs text-white/20 font-mono">
          Cada mesa crea o recupera su orden abierta · Datos en memoria del servidor
        </div>
      </div>
    </main>
  );
}
