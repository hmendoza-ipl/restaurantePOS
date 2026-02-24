"use client";

import { useEffect, useMemo, useState } from "react";

type OrderItemStatus = "queued" | "preparing" | "ready" | "served";

interface OrderItem {
  id: string;
  name: string;
  qty: number;
  unitPrice: number;
  station: string;
  status: OrderItemStatus;
  notes?: string;
  chosen?: Record<string, string>;
}

interface Order {
  id: string;
  tableCode: string;
  customerName?: string;
  status: "open" | "paid" | "closed";
  items: OrderItem[];
  updatedAt: string;
}

const statusFlow: OrderItemStatus[] = [
  "queued",
  "preparing",
  "ready",
  "served",
];

const statusStyle: Record<
  OrderItemStatus,
  { label: string; bg: string; border: string; color: string; icon: string }
> = {
  queued: {
    label: "En cola",
    bg: "rgba(245,158,11,0.12)",
    border: "rgba(245,158,11,0.3)",
    color: "#F59E0B",
    icon: "⏳",
  },
  preparing: {
    label: "Preparando",
    bg: "rgba(99,102,241,0.12)",
    border: "rgba(99,102,241,0.3)",
    color: "#6366F1",
    icon: "🔥",
  },
  ready: {
    label: "Listo",
    bg: "rgba(34,197,94,0.12)",
    border: "rgba(34,197,94,0.3)",
    color: "#22C55E",
    icon: "✅",
  },
  served: {
    label: "Servido",
    bg: "rgba(0,201,184,0.1)",
    border: "rgba(0,201,184,0.25)",
    color: "#00C9B8",
    icon: "🍽️",
  },
};

export default function KitchenScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<"active" | "all">("active");

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

  const kitchenItems = useMemo(() => {
    const rows: (OrderItem & {
      orderId: string;
      tableCode: string;
      customerName?: string;
    })[] = [];

    for (const o of orders.filter((x) => x.status !== "closed")) {
      for (const it of o.items.filter((i) => i.station === "kitchen")) {
        rows.push({
          orderId: o.id,
          tableCode: o.tableCode,
          customerName: o.customerName,
          ...it,
        });
      }
    }

    const filtered =
      filter === "active"
        ? rows.filter((i) => i.status !== "served")
        : rows;

    return filtered.sort(
      (a, b) =>
        statusFlow.indexOf(a.status) -
        statusFlow.indexOf(b.status)
    );
  }, [orders, filter]);

  async function setStatus(
    orderId: string,
    orderItemId: string,
    status: OrderItemStatus
  ) {
    await fetch(`/api/resto/orders/${orderId}/item`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderItemId, status }),
    });

    await load();
  }

  const counts = useMemo(
    () => ({
      queued: kitchenItems.filter((i) => i.status === "queued").length,
      preparing: kitchenItems.filter((i) => i.status === "preparing").length,
      ready: kitchenItems.filter((i) => i.status === "ready").length,
    }),
    [kitchenItems]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div
        className="rounded-[28px] p-6"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(0,201,184,0.1)",
        }}
      >
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="text-2xl font-bold flex items-center gap-2">
              🍳 Cocina
            </div>
            <div className="text-sm text-white/50 mt-1">
              Click en botones para cambiar estado
            </div>
          </div>

          <select
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value as "active" | "all")
            }
            className="rounded-xl px-3 py-2 text-sm outline-none"
            style={{
              background: "rgba(0,0,0,0.3)",
              border: "1px solid rgba(0,201,184,0.15)",
              color: "white",
            }}
          >
            <option value="active">Solo activos</option>
            <option value="all">Todos</option>
          </select>
        </div>
      </div>

      {/* Counters (FIX SIN LABEL DUPLICADO) */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { ...statusStyle.queued, count: counts.queued },
          { ...statusStyle.preparing, count: counts.preparing },
          { ...statusStyle.ready, label: "Listos", count: counts.ready },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-[20px] p-4 text-center"
            style={{
              background: s.bg,
              border: `1px solid ${s.border}`,
            }}
          >
            <div
              className="text-3xl font-extrabold"
              style={{ color: s.color }}
            >
              {s.count}
            </div>
            <div
              className="text-xs mt-1"
              style={{ color: s.color }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Items */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {kitchenItems.map((it) => {
          const ss = statusStyle[it.status];
          const nextStatus =
            statusFlow[statusFlow.indexOf(it.status) + 1];

          return (
            <div
              key={it.id}
              className="rounded-[22px] p-4 flex flex-col gap-3"
              style={{
                background: ss.bg,
                border: `2px solid ${ss.border}`,
              }}
            >
              <div className="flex justify-between">
                <div>
                  <div className="text-xs font-mono">
                    Mesa {it.tableCode}
                  </div>
                  <div className="font-bold">
                    {it.qty}× {it.name}
                  </div>
                </div>

                <div
                  className="px-2 py-1 rounded-full text-xs font-mono"
                  style={{
                    background: ss.border,
                    color: ss.color,
                  }}
                >
                  {ss.icon} {ss.label}
                </div>
              </div>

              {nextStatus && (
                <button
                  onClick={() =>
                    setStatus(it.orderId, it.id, nextStatus)
                  }
                  className="py-2 rounded-xl text-xs font-bold"
                  style={{
                    background:
                      "linear-gradient(135deg, #00C9B8, #0A6EBD)",
                    color: "#000",
                  }}
                >
                  → {statusStyle[nextStatus].icon}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}