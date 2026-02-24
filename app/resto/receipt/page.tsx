"use client";
import { getSession } from "@/lib/restoSession";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ReceiptPage() {
  const [url, setUrl] = useState("");

  useEffect(() => {
    const s = getSession();
    if (s?.orderId) setUrl(`/api/resto/receipt/${s.orderId}`);
  }, []);

  if (!url) return null;

  return (
    <div className="space-y-4">
      <div className="rounded-[28px] p-5"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(0,201,184,0.1)" }}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="text-2xl font-bold">Recibo / Factura</div>
            <div className="text-sm text-white/50 mt-1">Imprime o guarda como PDF desde el navegador.</div>
          </div>
          <a href={url} target="_blank" rel="noreferrer"
            className="px-4 py-2 rounded-xl text-sm font-semibold transition hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #00C9B8, #0A6EBD)", color: "#000" }}>
            🖨️ Abrir en nueva pestaña
          </a>
        </div>
      </div>

      <div className="rounded-[22px] overflow-hidden border"
        style={{ borderColor: "rgba(0,201,184,0.1)" }}>
        <iframe src={url} className="w-full h-[70vh]" style={{ background: "#fff" }} />
      </div>

      <Link href="/resto/pay"
        className="block text-center py-3 rounded-2xl text-sm text-white/40 hover:text-white/60 transition">
        ← Volver a pagar
      </Link>
    </div>
  );
}
