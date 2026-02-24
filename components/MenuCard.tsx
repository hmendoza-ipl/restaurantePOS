"use client";
import { useState } from "react";
import Image from "next/image";

export function MenuCard({ item, onAdd }: { item: any; onAdd: (payload: any) => void }) {
  const [qty, setQty] = useState(1);
  const [notes, setNotes] = useState("");
  const [chosen, setChosen] = useState<Record<string, string>>({});
  const [expanded, setExpanded] = useState(false);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    onAdd({ item, qty, notes, chosen });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    setExpanded(false);
    setQty(1);
    setNotes("");
    setChosen({});
  }

  const tagColors: Record<string, string> = {
    "Recomendado": "#00C9B8",
    "Popular": "#F59E0B",
    "Vegano": "#22C55E",
    "Sin gluten": "#8B5CF6",
    "Favorito": "#EC4899",
  };

  return (
    <div className="rounded-[22px] overflow-hidden flex flex-col transition-all"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(0,201,184,0.1)" }}>
      
      {/* Image */}
      <div className="relative h-44 overflow-hidden cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <img src={item.imageUrl} alt={item.name}
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-500" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(13,17,23,0.7) 0%, transparent 50%)" }} />
        
        {/* Tags */}
        {item.tags?.length && (
          <div className="absolute top-2 left-2 flex gap-1">
            {item.tags.map((tag: string) => (
              <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                style={{ background: tagColors[tag] || "#00C9B8", color: "#000" }}>
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Price overlay */}
        <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-full text-sm font-bold"
          style={{ background: "rgba(0,201,184,0.9)", color: "#000" }}>
          ${item.price}
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex-1 flex flex-col gap-2">
        <div>
          <div className="font-semibold">{item.name}</div>
          <div className="text-xs text-white/50 mt-0.5 leading-relaxed">{item.description}</div>
        </div>

        {/* Expand button */}
        {!expanded ? (
          <button onClick={() => setExpanded(true)}
            className="w-full py-2.5 rounded-xl text-sm font-semibold mt-auto transition"
            style={{ background: "rgba(0,201,184,0.1)", border: "1px solid rgba(0,201,184,0.2)", color: "#00C9B8" }}>
            + Agregar al carrito
          </button>
        ) : (
          <div className="space-y-3 mt-1">
            {/* Options */}
            {item.options?.map((opt: any) => (
              <div key={opt.name}>
                <div className="text-xs text-white/50 mb-1">{opt.name}</div>
                <select
                  className="w-full rounded-xl px-3 py-2 text-sm outline-none transition"
                  style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(0,201,184,0.15)", color: "white" }}
                  value={chosen[opt.name] || ""}
                  onChange={(e) => setChosen(p => ({ ...p, [opt.name]: e.target.value }))}>
                  <option value="">Selecciona…</option>
                  {opt.values.map((v: string) => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
            ))}

            {/* Notes */}
            <div>
              <div className="text-xs text-white/50 mb-1">Nota especial</div>
              <input
                className="w-full rounded-xl px-3 py-2 text-sm outline-none"
                style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(0,201,184,0.15)", color: "white" }}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ej: sin cebolla, poco picante…"
              />
            </div>

            {/* Qty + add */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 rounded-xl overflow-hidden"
                style={{ border: "1px solid rgba(0,201,184,0.2)" }}>
                <button className="px-3 py-2 text-sm font-bold transition hover:bg-white/5"
                  onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
                <div className="w-8 text-center text-sm font-semibold">{qty}</div>
                <button className="px-3 py-2 text-sm font-bold transition hover:bg-white/5"
                  onClick={() => setQty(qty + 1)}>+</button>
              </div>
              <button onClick={handleAdd}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold transition hover:opacity-90"
                style={{ background: added ? "#22C55E" : "linear-gradient(135deg, #00C9B8, #0A6EBD)", color: "#000" }}>
                {added ? "✓ Agregado" : `Agregar · $${(qty * item.price).toFixed(0)}`}
              </button>
            </div>

            <button onClick={() => setExpanded(false)} className="text-xs text-white/30 text-center hover:text-white/50 transition">
              Cancelar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
