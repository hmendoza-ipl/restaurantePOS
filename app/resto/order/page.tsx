"use client";

import { useEffect, useMemo, useState } from "react";
import { getSession } from "@/lib/restoSession";
import Link from "next/link";
import { useRouter } from "next/navigation";

const statusSteps = ["queued", "preparing", "ready", "served"];
const statusLabels: Record<string, { label: string; icon: string; color: string }> = {
  queued:    { label: "En cola",     icon: "⏳", color: "#F59E0B" },
  preparing: { label: "Preparando",  icon: "🔥", color: "#6366F1" },
  ready:     { label: "Listo ✓",     icon: "✅", color: "#22C55E" },
  served:    { label: "Servido",     icon: "🍽️", color: "#00C9B8" },
};

export default function OrderPage() {
  const [order, setOrder] = useState<any>(null);
  const [total, setTotal] = useState(0);
  const router = useRouter();

  async function load() {
    const s = getSession();
    if (!s?.orderId) return;
    const r = await fetch(`/api/resto/orders/${s.orderId}`);
    const data = await r.json();
    setOrder(data.order);
    setTotal(data.total || 0);
  }

  useEffect(() => {
    load();
    const t = setInterval(load, 1200);
    return () => clearInterval(t);
  }, []);

  const groups = useMemo(() => {
    if (!order?.items) return { kitchen: [], bar: [] };
    return {
      kitchen: order.items.filter((i: any) => i.station === "kitchen"),
      bar: order.items.filter((i: any) => i.station === "bar"),
    };
  }, [order]);

  const overallProgress = useMemo(() => {
    if (!order?.items?.length) return 0;
    const total = order.items.length;
    const done = order.items.filter((i: any) => i.status === "served" || i.status === "ready").length;
    return Math.round((done / total) * 100);
  }, [order]);

  const allReady = useMemo(() => {
    if (!order?.items?.length) return false;
    return order.items.every((i: any) => i.status === "ready" || i.status === "served");
  }, [order]);

  if (!order) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="size-8 rounded-full border-2 border-teal-500/30 border-t-teal-500 animate-spin" />
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="rounded-[28px] p-5"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(0,201,184,0.1)" }}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="text-2xl font-bold">Mi Orden</div>
            <div className="text-sm text-white/50 mt-1">
              Mesa {order.tableCode} · Orden #{order.id.slice(0, 6).toUpperCase()}
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/resto/menu"
              className="px-4 py-2 rounded-xl text-sm font-medium transition"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
              + Más
            </Link>
            <Link href="/resto/pay"
              className="px-4 py-2 rounded-xl text-sm font-bold transition hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #00C9B8, #0A6EBD)", color: "#000" }}>
              Pagar
            </Link>
          </div>
        </div>

        {/* Progress bar */}
        {order.items.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-white/40 mb-1">
              <span>Progreso del pedido</span>
              <span className="font-mono">{overallProgress}%</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
              <div className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${overallProgress}%`,
                  background: "linear-gradient(90deg, #00C9B8, #0A6EBD)",
                  boxShadow: "0 0 8px rgba(0,201,184,0.4)",
                }} />
            </div>
          </div>
        )}
      </div>

      {/* All ready banner */}
      {allReady && order.items.length > 0 && (
        <div className="rounded-2xl p-4 text-center font-semibold"
          style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", color: "#22C55E" }}>
          🎉 ¡Todo listo! Tu pedido está completo.
          <Link href="/resto/pay" className="ml-3 underline text-sm">Ir a pagar →</Link>
        </div>
      )}

      {/* Kitchen items */}
      {groups.kitchen.length > 0 && (
        <StationPanel title="Cocina" icon="🍳" items={groups.kitchen} />
      )}

      {/* Bar items */}
      {groups.bar.length > 0 && (
        <StationPanel title="Bar" icon="🍹" items={groups.bar} />
      )}

      {order.items.length === 0 && (
        <div className="py-16 text-center space-y-3">
          <div className="text-4xl">📋</div>
          <div className="text-white/50">Aún no has enviado nada.</div>
          <Link href="/resto/menu"
            className="inline-block px-5 py-2.5 rounded-xl font-semibold text-sm"
            style={{ background: "linear-gradient(135deg, #00C9B8, #0A6EBD)", color: "#000" }}>
            Ver el menú
          </Link>
        </div>
      )}

      {/* Total */}
      {order.items.length > 0 && (
        <div className="rounded-[22px] p-5 flex items-center justify-between"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div>
            <div className="text-sm text-white/50">Total actual</div>
            <div className="text-3xl font-extrabold" style={{ color: "#00C9B8" }}>${total.toFixed(2)}</div>
          </div>
          <div className="flex items-center gap-1 text-xs text-white/30">
            <span className="size-2 rounded-full bg-teal-500 animate-pulse" />
            actualizando…
          </div>
        </div>
      )}
    </div>
  );
}

function StationPanel({ title, icon, items }: { title: string; icon: string; items: any[] }) {
  return (
    <div className="rounded-[22px] overflow-hidden"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="px-5 py-3 flex items-center gap-2 border-b"
        style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
        <span className="text-lg">{icon}</span>
        <span className="font-semibold">{title}</span>
        <span className="ml-auto text-xs text-white/40 font-mono">{items.length} items</span>
      </div>
      <div className="p-3 space-y-2">
        {items.map((item: any) => {
          const sc = statusLabels[item.status] || statusLabels.queued;
          const progress = (statusSteps.indexOf(item.status) + 1) / statusSteps.length * 100;
          return (
            <div key={item.id} className="rounded-xl p-3"
              style={{ background: "rgba(0,0,0,0.2)", border: `1px solid ${sc.color}20` }}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-medium">{item.qty}× {item.name}</div>
                  {item.notes && <div className="text-xs text-white/35 mt-0.5">📝 {item.notes}</div>}
                </div>
                <div className="flex items-center gap-1.5 shrink-0 text-xs font-mono px-2 py-1 rounded-full"
                  style={{ background: `${sc.color}15`, color: sc.color, border: `1px solid ${sc.color}30` }}>
                  {sc.icon} {sc.label}
                </div>
              </div>
              <div className="mt-2 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                <div className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${progress}%`, background: sc.color }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
