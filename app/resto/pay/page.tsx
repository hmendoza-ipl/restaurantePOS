"use client";

import { useEffect, useState } from "react";
import { getSession } from "@/lib/restoSession";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PayPage() {
  const [order, setOrder] = useState<any>(null);
  const [total, setTotal] = useState(0);
  const [paying, setPaying] = useState(false);
  const router = useRouter();

  async function load() {
    const s = getSession();
    if (!s?.orderId) return;
    const r = await fetch(`/api/resto/orders/${s.orderId}`);
    const data = await r.json();
    setOrder(data.order);
    setTotal(data.total || 0);
  }

  useEffect(() => { load(); }, []);

  async function payDemo() {
    const s = getSession();
    if (!s?.orderId) return;
    setPaying(true);
    await fetch(`/api/resto/orders/${s.orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "pay" }),
    });
    await load();
    setPaying(false);
  }

  if (!order) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="size-8 rounded-full border-2 border-teal-500/30 border-t-teal-500 animate-spin" />
    </div>
  );

  const isPaid = order.status === "paid" || order.status === "closed";
  const subtotal = total / 1.16;
  const iva = total - subtotal;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="rounded-[28px] p-5"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(0,201,184,0.1)" }}>
        <div className="text-2xl font-bold">Pagar</div>
        <div className="text-sm text-white/50 mt-1">
          Mesa {order.tableCode} · #{order.id.slice(0, 6).toUpperCase()}
        </div>
        {isPaid && (
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold"
            style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", color: "#22C55E" }}>
            ✅ Pago registrado
          </div>
        )}
      </div>

      {/* Order summary */}
      <div className="rounded-[22px] overflow-hidden"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="px-5 py-3 border-b font-semibold text-sm"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          Resumen de orden
        </div>
        <div className="p-4 space-y-2">
          {order.items.map((item: any) => (
            <div key={item.id} className="flex items-center justify-between text-sm">
              <div className="text-white/70">{item.qty}× {item.name}</div>
              <div className="font-mono">${(item.qty * item.unitPrice).toFixed(2)}</div>
            </div>
          ))}
        </div>
        <div className="px-4 pb-4 space-y-1 border-t"
          style={{ borderColor: "rgba(255,255,255,0.06)", paddingTop: "12px" }}>
          <div className="flex justify-between text-sm text-white/50">
            <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-white/50">
            <span>IVA 16%</span><span>${iva.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-base font-bold mt-2" style={{ color: "#00C9B8" }}>
            <span>Total</span><span>${total.toFixed(2)} MXN</span>
          </div>
        </div>
      </div>

      {/* Payment methods */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Transfer */}
        <div className="rounded-[22px] p-5 space-y-3"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(0,201,184,0.1)" }}>
          <div className="flex items-center gap-2 font-semibold">
            <span className="text-xl">🏦</span> Transferencia
          </div>
          <div className="space-y-1 text-sm text-white/60 font-mono">
            <div>CLABE: <span className="text-white">012345678901234567</span></div>
            <div>Banco: <span className="text-white">DemoBank</span></div>
            <div>Ref: <span className="text-white">{order.tableCode}-{order.id.slice(0, 6).toUpperCase()}</span></div>
          </div>
          {!isPaid && (
            <button onClick={payDemo} disabled={paying}
              className="w-full py-3 rounded-xl font-bold text-sm transition hover:opacity-90 disabled:opacity-60"
              style={{ background: "linear-gradient(135deg, #00C9B8, #0A6EBD)", color: "#000" }}>
              {paying ? "Procesando…" : "✓ Ya pagué (demo)"}
            </button>
          )}
        </div>

        {/* QR / Card */}
        <div className="rounded-[22px] p-5 space-y-3"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-2 font-semibold">
            <span className="text-xl">💳</span> Tarjeta / QR
          </div>
          <div className="text-sm text-white/50">
            En producción: Stripe, Clip, Conekta o terminal física.
          </div>
          <div className="rounded-xl p-4 text-center text-white/20 text-xs"
            style={{ background: "rgba(0,0,0,0.2)", border: "1px dashed rgba(255,255,255,0.08)" }}>
            [Terminal de pago aquí]
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="grid sm:grid-cols-2 gap-3">
        <Link href={`/api/resto/receipt/${order.id}`} target="_blank"
          className="py-3 rounded-2xl text-center font-semibold text-sm transition"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
          🧾 Ver recibo / factura
        </Link>
        {isPaid ? (
          <Link href="/resto/rate"
            className="py-3 rounded-2xl text-center font-bold text-sm transition hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #00C9B8, #0A6EBD)", color: "#000" }}>
            ⭐ Calificar y cerrar
          </Link>
        ) : (
          <div className="py-3 rounded-2xl text-center text-sm text-white/30"
            style={{ border: "1px dashed rgba(255,255,255,0.08)" }}>
            Paga primero para calificar
          </div>
        )}
      </div>
    </div>
  );
}
