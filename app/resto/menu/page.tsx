"use client";

import { useEffect, useMemo, useState } from "react";
import { getSession } from "@/lib/restoSession";
import { MenuCard } from "@/components/MenuCard";
import { useRouter } from "next/navigation";

const CART_KEY = "dinerflow_cart";

const catIcons: Record<string, string> = {
  "Todos": "🍽️", "Cafés": "☕", "Desayunos": "🍳", "Entradas": "🥗",
  "Platos": "🍖", "Postres": "🍰", "Bebidas": "🥤", "Cocteles": "🍹",
};

export default function MenuPage() {
  const [menu, setMenu] = useState<any[]>([]);
  const [cat, setCat] = useState<string>("Todos");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch("/api/resto/menu").then(r => r.json()).then(d => setMenu(d.menu || []));
  }, []);

  const cats = useMemo(() => ["Todos", ...Array.from(new Set(menu.map((m: any) => m.category)))], [menu]);

  const view = useMemo(() => {
    let list = cat === "Todos" ? menu : menu.filter((m: any) => m.category === cat);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((m: any) => m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q));
    }
    return list;
  }, [menu, cat, search]);

  function addToCart(payload: any) {
    const s = getSession();
    if (!s?.orderId) return router.push("/resto");
    const raw = localStorage.getItem(CART_KEY);
    const cart = raw ? JSON.parse(raw) : [];
    const station = ["Cocteles", "Bebidas", "Cafés"].includes(payload.item.category) ? "bar" : "kitchen";
    cart.push({
      menuItemId: payload.item.id,
      name: payload.item.name,
      qty: payload.qty,
      unitPrice: payload.item.price,
      notes: payload.notes,
      chosen: payload.chosen,
      station,
    });
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    setToast(`✓ ${payload.qty}× ${payload.item.name} al carrito`);
    setTimeout(() => setToast(""), 2500);
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="rounded-[28px] p-5"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(0,201,184,0.1)" }}>
        <div className="text-2xl font-bold">Nuestro Menú</div>
        <div className="text-sm text-white/50 mt-1">Pide directamente a cocina y bar. Sin esperar al mesero.</div>

        {/* Search */}
        <div className="mt-4 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">🔍</span>
          <input
            className="w-full rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none transition"
            style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.08)", color: "white" }}
            placeholder="Buscar platillo o bebida…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Category filters */}
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {cats.map((c) => (
            <button key={c} onClick={() => setCat(c)}
              className="px-3 py-2 rounded-xl text-sm font-medium flex items-center gap-1.5 whitespace-nowrap transition shrink-0"
              style={{
                background: cat === c ? "rgba(0,201,184,0.15)" : "rgba(0,0,0,0.25)",
                border: cat === c ? "1px solid rgba(0,201,184,0.3)" : "1px solid rgba(255,255,255,0.06)",
                color: cat === c ? "#00C9B8" : "rgba(255,255,255,0.6)",
              }}>
              <span>{catIcons[c] || "🍽️"}</span>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {view.map((item) => (
          <MenuCard key={item.id} item={item} onAdd={addToCart} />
        ))}
        {!view.length && (
          <div className="col-span-3 py-16 text-center text-white/30">
            <div className="text-4xl mb-3">🔍</div>
            <div>Sin resultados para "{search}"</div>
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-3 rounded-2xl text-sm font-semibold shadow-xl z-50 flex items-center gap-2"
          style={{ background: "#00C9B8", color: "#000", boxShadow: "0 0 24px rgba(0,201,184,0.4)" }}>
          {toast}
        </div>
      )}
    </div>
  );
}
