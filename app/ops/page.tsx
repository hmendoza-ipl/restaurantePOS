"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

export default function OpsManager() {
  const [orders, setOrders] = useState<any[]>([]);

  async function load() {
    const r = await fetch("/api/resto/orders");
    const data = await r.json();
    setOrders(data.orders || []);
  }

  useEffect(() => {
    load();
    const t = setInterval(load, 1200);
    return () => clearInterval(t);
  }, []);

  const kpis = useMemo(() => {
    const open = orders.filter(o => o.status === "open");
    const paid = orders.filter(o => o.status === "paid");
    const closed = orders.filter(o => o.status === "closed");
    const totalRevenue = [...paid, ...closed].reduce((sum, o) => {
      return sum + o.items.reduce((s: number, i: any) => s + i.qty * i.unitPrice, 0);
    }, 0);
    const queuedItems = orders.filter(o => o.status === "open")
      .flatMap(o => o.items).filter((i: any) => i.status === "queued").length;
    const avgRating = orders.filter(o => o.rating).length
      ? (orders.filter(o => o.rating).reduce((s, o) => s + o.rating.stars, 0) / orders.filter(o => o.rating).length).toFixed(1)
      : "—";
    return { open: open.length, paid: paid.length, closed: closed.length, totalRevenue, queuedItems, avgRating };
  }, [orders]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-[28px] p-6"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(0,201,184,0.1)" }}>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="text-xs text-white/40 font-mono uppercase tracking-wider">DinerFlow AI</div>
            <div className="text-2xl font-bold mt-1">Dashboard del Manager</div>
            <div className="text-sm text-white/50 mt-1">
              {new Date().toLocaleDateString("es-MX", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/ops/kitchen"
              className="px-4 py-2 rounded-xl text-sm font-semibold transition hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #00C9B8, #0A6EBD)", color: "#000" }}>
              🍳 Ver Cocina
            </Link>
            <Link href="/ops/bar"
              className="px-4 py-2 rounded-xl text-sm font-medium transition"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
              🍹 Ver Bar
            </Link>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: "Mesas abiertas", value: kpis.open, icon: "🍽️", color: "#00C9B8" },
          { label: "Por cobrar", value: kpis.paid, icon: "💳", color: "#F59E0B" },
          { label: "Cerradas", value: kpis.closed, icon: "✅", color: "#22C55E" },
          { label: "Items en cola", value: kpis.queuedItems, icon: "⏳", color: "#6366F1" },
          { label: "Ingresos", value: `$${kpis.totalRevenue.toFixed(0)}`, icon: "💰", color: "#EC4899" },
          { label: "Rating prom.", value: kpis.avgRating === "—" ? "—" : `${kpis.avgRating}⭐`, icon: "⭐", color: "#F59E0B" },
        ].map((k) => (
          <div key={k.label} className="rounded-[20px] p-4"
            style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${k.color}20` }}>
            <div className="text-xl mb-1">{k.icon}</div>
            <div className="text-2xl font-extrabold" style={{ color: k.color }}>{k.value}</div>
            <div className="text-xs text-white/40 mt-0.5">{k.label}</div>
          </div>
        ))}
      </div>

      {/* Orders list */}
      <div className="space-y-3">
        <div className="text-sm font-semibold text-white/60 uppercase tracking-wider font-mono px-1">
          Todas las órdenes ({orders.length})
        </div>
        {orders.length === 0 ? (
          <div className="py-16 text-center rounded-[22px]"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="text-4xl mb-3">📋</div>
            <div className="text-white/40">Sin órdenes aún. Abre el módulo cliente en /resto.</div>
          </div>
        ) : (
          orders.map((o) => {
            const itemTotal = o.items.reduce((s: number, i: any) => s + i.qty * i.unitPrice, 0);
            const queuedCount = o.items.filter((i: any) => i.status === "queued").length;
            const readyCount = o.items.filter((i: any) => i.status === "ready").length;

            const statusColor: Record<string, string> = {
              open: "#00C9B8", paid: "#F59E0B", closed: "#22C55E"
            };

            return (
              <div key={o.id} className="rounded-[22px] p-5"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-bold text-lg">Mesa {o.tableCode}</span>
                      {o.customerName && <span className="text-sm text-white/50">({o.customerName})</span>}
                      <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold"
                        style={{ background: `${statusColor[o.status]}20`, color: statusColor[o.status], border: `1px solid ${statusColor[o.status]}30` }}>
                        {o.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-white/40 flex-wrap">
                      <span>#{o.id.slice(0, 6).toUpperCase()}</span>
                      <span>{o.items.length} items</span>
                      {queuedCount > 0 && <span className="text-amber-400">⏳ {queuedCount} en cola</span>}
                      {readyCount > 0 && <span className="text-emerald-400">✅ {readyCount} listos</span>}
                      <span>{new Date(o.updatedAt).toLocaleTimeString("es-MX")}</span>
                    </div>
                    {o.rating && (
                      <div className="mt-2 text-xs text-white/40">
                        Rating: {"⭐".repeat(o.rating.stars)} {o.rating.comment ? `· "${o.rating.comment}"` : ""}
                      </div>
                    )}
                  </div>
                  <div className="text-xl font-extrabold" style={{ color: "#00C9B8" }}>
                    ${itemTotal.toFixed(2)}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
