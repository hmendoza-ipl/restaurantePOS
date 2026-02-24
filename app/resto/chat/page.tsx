"use client";

import { useEffect, useRef, useState } from "react";
import { getSession } from "@/lib/restoSession";

type Msg = { from: "you" | "ai"; text: string; time: string };

const suggestions = [
  "¿Qué recomiendas hoy?",
  "¿Qué opciones tienen sin gluten?",
  "¿Cuál es el platillo más popular?",
  "Recomiéndame un coctel",
  "¿Tienen opciones veganas?",
  "¿Qué va bien con la hamburguesa?",
];

export default function WaiterChat() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { from: "ai", text: "¡Hola! 👋 Soy tu mesero IA. Puedo recomendarte platillos, informarte sobre alérgenos, sugerir maridajes o ayudarte con cualquier duda del menú. ¿En qué te ayudo?", time: now() },
  ]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  function now() {
    return new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  async function ask(question?: string) {
    const s = getSession();
    const q = (question || text).trim();
    if (!q) return;
    setText("");
    setMsgs(m => [...m, { from: "you", text: q, time: now() }]);
    setLoading(true);

    const r = await fetch("/api/n8n/waiter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: s?.orderId, question: q }),
    });
    const data = await r.json();
    setMsgs(m => [...m, { from: "ai", text: data.reply, time: now() }]);
    setLoading(false);
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); ask(); }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-[28px] p-5"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(0,201,184,0.1)" }}>
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl flex items-center justify-center text-xl"
            style={{ background: "linear-gradient(135deg, #00C9B8, #0A6EBD)" }}>🤖</div>
          <div>
            <div className="font-bold">Mesero IA</div>
            <div className="text-xs text-white/50">Recomendaciones · Alérgenos · Maridaje · Preguntas</div>
          </div>
          <div className="ml-auto flex items-center gap-1.5 text-xs" style={{ color: "#22C55E" }}>
            <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
            En línea
          </div>
        </div>
      </div>

      {/* Chat */}
      <div className="rounded-[22px] overflow-hidden flex flex-col"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(0,201,184,0.08)" }}>
        <div className="flex-1 h-[380px] overflow-y-auto p-4 space-y-3" style={{ background: "rgba(0,0,0,0.15)" }}>
          {msgs.map((m, idx) => (
            <div key={idx} className={`flex flex-col ${m.from === "you" ? "items-end" : "items-start"} gap-0.5`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                m.from === "you"
                  ? "rounded-tr-sm text-black"
                  : "rounded-tl-sm"
              }`}
                style={m.from === "you"
                  ? { background: "#00C9B8" }
                  : { background: "rgba(10,110,189,0.2)", border: "1px solid rgba(0,201,184,0.15)" }
                }>
                {m.text}
              </div>
              <div className="text-[10px] text-white/25 px-1">{m.time}</div>
            </div>
          ))}
          {loading && (
            <div className="flex items-start gap-2">
              <div className="rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2"
                style={{ background: "rgba(10,110,189,0.2)", border: "1px solid rgba(0,201,184,0.15)" }}>
                <span className="size-1.5 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="size-1.5 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="size-1.5 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t flex gap-2"
          style={{ borderColor: "rgba(0,201,184,0.08)" }}>
          <input
            className="flex-1 rounded-xl px-4 py-3 text-sm outline-none transition"
            style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(0,201,184,0.15)", color: "white" }}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Pregunta lo que quieras…"
            disabled={loading}
          />
          <button onClick={() => ask()}
            disabled={!text.trim() || loading}
            className="px-4 rounded-xl font-bold text-sm transition hover:opacity-90 disabled:opacity-40"
            style={{ background: "linear-gradient(135deg, #00C9B8, #0A6EBD)", color: "#000" }}>
            →
          </button>
        </div>
      </div>

      {/* Suggestions */}
      <div>
        <div className="text-xs text-white/30 mb-2 px-1">Sugerencias:</div>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button key={s} onClick={() => ask(s)}
              className="px-3 py-1.5 rounded-xl text-xs transition"
              style={{ background: "rgba(0,201,184,0.07)", border: "1px solid rgba(0,201,184,0.15)", color: "rgba(255,255,255,0.6)" }}>
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
