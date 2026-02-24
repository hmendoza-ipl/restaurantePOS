"use client";

import { useEffect, useMemo, useState } from "react";
import { getSession } from "@/lib/restoSession";
import { useRouter } from "next/navigation";
import Link from "next/link";

const CART_KEY = "dinerflow_cart";

export default function CartPage() {
  const [cart, setCart] = useState<any[]>([]);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const raw = localStorage.getItem(CART_KEY);
    setCart(raw ? JSON.parse(raw) : []);
  }, []);

  const total = useMemo(() => cart.reduce((s, i) => s + i.qty * i.unitPrice, 0), [cart]);
  const byStation = useMemo(() => ({
    kitchen: cart.filter(i => i.station === "kitchen"),
    bar: cart.filter(i => i.station === "bar"),
  }), [cart]);

  function remove(idx: number) {
    const next = cart.filter((_, i) => i !== idx);
    setCart(next);
    localStorage.setItem(CART_KEY, JSON.stringify(next));
  }

  function updateQty(idx: number, delta: number) {
    const next = cart.map((item, i) => {
      if (i !== idx) return item;
      return { ...item, qty: Math.max(1, item.qty + delta) };
    });
    setCart(next);
    localStorage.setItem(CART_KEY, JSON.stringify(next));
  }

  async function confirm() {
    const s = getSession();
    if (!s?.orderId) return router.push("/resto");
    if (!cart.length) return;
    setSending(true);
    await fetch(`/api/resto/orders/${s.orderId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: cart }),
    });
    localStorage.removeItem(CART_KEY);
    setDone(true);
    setTimeout(() => router.push("/resto/order"), 1800);
  }

  if (done) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="text-6xl">✅</div>
      <div className="text-2xl font-bold text-center">¡Pedido enviado!</div>
      <div className="text-white/50 text-center">Va directo a cocina y bar. Redirigiendo…</div>
      <div className="size-6 rounded-full border-2 border-teal-500/30 border-t-teal-500 animate-spin mt-2" />
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="rounded-[28px] p-5"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(0,201,184,0.1)" }}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold">Carrito</div>
            <div className="text-sm text-white/50 mt-1">{cart.length} {cart.length === 1 ? "producto" : "productos"}</div>
          </div>
          {cart.length > 0 && (
            <Link href="/resto/menu"
              className="px-4 py-2 rounded-xl text-sm font-medium transition"
              style={{ background: "rgba(0,201,184,0.1)", border: "1px solid rgba(0,201,184,0.2)", color: "#00C9B8" }}>
              + Agregar más
            </Link>
          )}
        </div>
      </div>

      {cart.length === 0 ? (
        <div className="py-20 text-center space-y-4">
          <div className="text-6xl">🛒</div>
          <div className="text-xl font-semibold text-white/60">Tu carrito está vacío</div>
          <Link href="/resto/menu"
            className="inline-block px-6 py-3 rounded-2xl font-semibold text-sm transition hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #00C9B8, #0A6EBD)", color: "#000" }}>
            Ver el menú
          </Link>
        </div>
      ) : (
        <>
          {/* Stations */}
          {byStation.kitchen.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2 px-1">
                <span>🍳</span>
                <span className="text-sm font-semibold text-white/60 uppercase tracking-wider font-mono">Cocina</span>
              </div>
              <div className="space-y-2">
                {cart.map((item, idx) => item.station !== "kitchen" ? null : (
                  <CartItem key={idx} item={item} idx={idx} onRemove={remove} onQty={updateQty} />
                ))}
              </div>
            </div>
          )}

          {byStation.bar.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2 px-1">
                <span>🍹</span>
                <span className="text-sm font-semibold text-white/60 uppercase tracking-wider font-mono">Bar</span>
              </div>
              <div className="space-y-2">
                {cart.map((item, idx) => item.station !== "bar" ? null : (
                  <CartItem key={idx} item={item} idx={idx} onRemove={remove} onQty={updateQty} />
                ))}
              </div>
            </div>
          )}

          {/* Summary */}
          <div className="rounded-[22px] p-5"
            style={{ background: "rgba(0,201,184,0.06)", border: "1px solid rgba(0,201,184,0.15)" }}>
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-white/60">Total del pedido</div>
              <div className="text-3xl font-extrabold" style={{ color: "#00C9B8" }}>${total.toFixed(2)}</div>
            </div>
            <button onClick={confirm} disabled={sending}
              className="w-full py-4 rounded-2xl font-bold text-base transition hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(135deg, #00C9B8, #0A6EBD)", color: "#000", boxShadow: "0 0 24px rgba(0,201,184,0.25)" }}>
              {sending ? <><span className="size-4 rounded-full border-2 border-black/20 border-t-black animate-spin" />Enviando…</> : "⚡ Confirmar pedido"}
            </button>
            <div className="text-xs text-white/30 text-center mt-2">
              Tu pedido irá directo a cocina y bar
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function CartItem({ item, idx, onRemove, onQty }: any) {
  return (
    <div className="rounded-[18px] p-4 flex items-center gap-4"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm">{item.name}</div>
        {item.chosen && Object.values(item.chosen).some(Boolean) && (
          <div className="text-xs text-white/40 mt-0.5">
            {Object.entries(item.chosen).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join(" · ")}
          </div>
        )}
        {item.notes && <div className="text-xs text-white/30 mt-0.5">📝 {item.notes}</div>}
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button onClick={() => onQty(idx, -1)}
          className="size-7 rounded-lg text-sm font-bold transition hover:bg-white/10 flex items-center justify-center"
          style={{ border: "1px solid rgba(255,255,255,0.1)" }}>−</button>
        <span className="w-6 text-center text-sm font-bold">{item.qty}</span>
        <button onClick={() => onQty(idx, 1)}
          className="size-7 rounded-lg text-sm font-bold transition hover:bg-white/10 flex items-center justify-center"
          style={{ border: "1px solid rgba(255,255,255,0.1)" }}>+</button>
      </div>

      <div className="text-sm font-bold shrink-0" style={{ color: "#00C9B8" }}>
        ${(item.qty * item.unitPrice).toFixed(0)}
      </div>

      <button onClick={() => onRemove(idx)}
        className="text-white/25 hover:text-red-400 transition text-lg shrink-0">✕</button>
    </div>
  );
}
