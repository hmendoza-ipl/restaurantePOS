"use client";

import { useEffect, useMemo, useState } from "react";

const statusFlow = ["queued", "preparing", "ready", "served"];

const statusStyle: Record<string, { label: string; bg: string; border: string; color: string; icon: string }> = {
  queued:    { label: "En cola",    bg: "rgba(245,158,11,0.12)",   border: "rgba(245,158,11,0.3)",   color: "#F59E0B", icon: "⏳" },
  preparing: { label: "Preparando", bg: "rgba(99,102,241,0.12)",   border: "rgba(99,102,241,0.3)",   color: "#6366F1", icon: "🔥" },
  ready:     { label: "Listo",      bg: "rgba(34,197,94,0.12)",    border: "rgba(34,197,94,0.3)",    color: "#22C55E", icon: "✅" },
  served:    { label: "Servido",    bg: "rgba(0,201,184,0.1)",     border: "rgba(0,201,184,0.25)",   color: "#00C9B8", icon: "🍽️" },
};

export default function KitchenScreen() {
  const [orders, setOrders] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>("active");

  async function load() {
    const r = await fetch("/api/resto/orders");
    const data = await r.json();
    setOrders(data.orders || []);
  }

  useEffect(() => {
    load();
    const t = setInterval(load, 1000);
    return () => clearInterval(t);
  }, []);

  const kitchenItems = useMemo(() => {
    const rows: any[] = [];
    for (const o of orders.filter(x => x.status !== "closed")) {
      for (const it of o.items.filter((i: any) => i.station === "kitchen")) {
        rows.push({ orderId: o.id, tableCode: o.tableCode, customerName: o.customerName, ...it });
      }
    }
    const filtered = filter === "active"
      ? rows.filter(i => i.status !== "served")
      : rows;
    // Sort: queued first, then preparing, then ready, then served
    return filtered.sort((a, b) => statusFlow.indexOf(a.status) - statusFlow.indexOf(b.status));
  }, [orders, filter]);

  async function setStatus(orderId: string, orderItemId: string, status: string) {
    await fetch(`/api/resto/orders/${orderId}/item`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderItemId, status }),
    });
    await load();
  }

  const counts = useMemo(() => ({
    queued: kitchenItems.filter(i => i.status === "queued").length,
    preparing: kitchenItems.filter(i => i.status === "preparing").length,
    ready: kitchenItems.filter(i => i.status === "ready").length,
  }), [kitchenItems]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="rounded-[28px] p-5 flex items-start justify-between flex-wrap gap-4"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(0,201,184,0.1)" }}>
        <div>
          <div className="text-2xl font-bold flex items-center gap-2">🍳 Kitchen Screen</div>
          <div className="text-sm text-white/50 mt-1">Haz clic en los botones para cambiar el estado del item</div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs text-white/30">
            <span className="size-2 rounded-full bg-teal-400 animate-pulse" />
            Auto-refresh 1s
          </div>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}
            className="rounded-xl px-3 py-2 text-sm outline-none"
            style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(0,201,184,0.15)", color: "white" }}>
            <option value="active">Solo activos</option>
            <option value="all">Todos</option>
          </select>
        </div>
      </div>

      {/* Status counters */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "En cola", count: counts.queued, ...statusStyle.queued },
          { label: "Preparando", count: counts.preparing, ...statusStyle.preparing },
          { label: "Listos", count: counts.ready, ...statusStyle.ready },
        ].map((s) => (
          <div key={s.label} className="rounded-[20px] p-4 text-center"
            style={{ background: s.bg, border: `1px solid ${s.border}` }}>
            <div className="text-3xl font-extrabold" style={{ color: s.color }}>{s.count}</div>
            <div className="text-xs mt-1" style={{ color: s.color }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Items */}
      {kitchenItems.length === 0 ? (
        <div className="py-20 text-center rounded-[22px]"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="text-5xl mb-3">✅</div>
          <div className="text-xl font-semibold text-white/60">¡Cocina al día!</div>
          <div className="text-sm text-white/30 mt-1">Sin items pendientes en cocina</div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {kitchenItems.map((it) => {
            const ss = statusStyle[it.status] || statusStyle.queued;
            const nextStatus = statusFlow[statusFlow.indexOf(it.status) + 1];
            return (
              <div key={it.id} className="rounded-[22px] p-4 flex flex-col gap-3 transition-all"
                style={{ background: ss.bg, border: `2px solid ${ss.border}`, ...(it.status === "ready" ? { boxShadow: `0 0 20px ${ss.border}` } : {}) }}>
                
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-xs font-mono" style={{ color: ss.color }}>
                      Mesa {it.tableCode}{it.customerName ? ` · ${it.customerName}` : ""}
                    </div>
                    <div className="font-bold text-lg mt-0.5">{it.qty}× {it.name}</div>
                  </div>
                  <div className="px-2 py-1 rounded-full text-xs font-mono flex items-center gap-1"
                    style={{ background: `${ss.border}`, color: ss.color }}>
                    {ss.icon} {ss.label}
                  </div>
                </div>

                {/* Options */}
                {it.chosen && Object.values(it.chosen).some(Boolean) && (
                  <div className="text-xs text-white/50 flex flex-wrap gap-1">
                    {Object.entries(it.chosen)
                      .filter(([, v]) => v)
                      .map(([k, v]) => (
                        <span key={k} className="px-1.5 py-0.5 rounded-lg"
                          style={{ background: "rgba(0,0,0,0.3)" }}>
                          {k}: {v as string}
                        </span>
                      ))}
                  </div>
                )}

                {/* Notes */}
                {it.notes && (
                  <div className="text-xs px-3 py-2 rounded-xl"
                    style={{ background: "rgba(0,0,0,0.3)", color: "rgba(255,255,255,0.6)" }}>
                    📝 {it.notes}
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-2 mt-auto">
                  {statusFlow.slice(0, -1).map((s) => (
                    <button key={s} onClick={() => setStatus(it.orderId, it.id, s)}
                      disabled={it.status === s}
                      className="flex-1 py-2 rounded-xl text-xs font-semibold transition"
                      style={{
                        background: it.status === s ? `${statusStyle[s].border}` : "rgba(0,0,0,0.3)",
                        color: statusStyle[s].color,
                        border: `1px solid ${statusStyle[s].border}`,
                        opacity: it.status === s ? 1 : 0.6,
                      }}>
                      {statusStyle[s].icon}
                    </button>
                  ))}
                  {nextStatus && (
                    <button onClick={() => setStatus(it.orderId, it.id, nextStatus)}
                      className="flex-1 py-2 rounded-xl text-xs font-bold transition hover:opacity-90"
                      style={{ background: "linear-gradient(135deg, #00C9B8, #0A6EBD)", color: "#000" }}>
                      → {statusStyle[nextStatus].icon}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
