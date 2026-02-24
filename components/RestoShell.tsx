"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearSession, getSession } from "@/lib/restoSession";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/resto/menu", label: "Menú", icon: "🍽️" },
  { href: "/resto/cart", label: "Carrito", icon: "🛒" },
  { href: "/resto/order", label: "Mi Orden", icon: "📋" },
  { href: "/resto/chat", label: "Mesero IA", icon: "🤖" },
  { href: "/resto/pay", label: "Pagar", icon: "💳" },
];

export function RestoShell({ children }: { children: React.ReactNode }) {
  const [s, setS] = useState<any>(null);
  const [cartCount, setCartCount] = useState(0);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setS(getSession());
    const raw = localStorage.getItem("dinerflow_cart");
    const cart = raw ? JSON.parse(raw) : [];
    const total = cart.reduce((acc: number, i: any) => acc + i.qty, 0);
    setCartCount(total);

    const interval = setInterval(() => {
      const raw2 = localStorage.getItem("dinerflow_cart");
      const cart2 = raw2 ? JSON.parse(raw2) : [];
      setCartCount(cart2.reduce((acc: number, i: any) => acc + i.qty, 0));
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b backdrop-blur-xl"
        style={{ borderColor: "rgba(0,201,184,0.12)", background: "rgba(13,17,23,0.85)" }}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="relative">
              <div className="absolute inset-0 blur-lg rounded-full" style={{ background: "rgba(0,201,184,0.3)" }} />
              <Image src="/logo.png" alt="DinerFlow" width={36} height={36} className="relative rounded-full" />
            </div>
            <div>
              <div className="font-bold text-sm leading-none">
                <span style={{ background: "linear-gradient(135deg, #00C9B8, #0A6EBD)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  DinerFlow
                </span>
                <span className="text-white"> AI</span>
              </div>
              <div className="text-[10px] text-white/40 font-mono">
                Mesa: <span className="font-bold" style={{ color: "#00C9B8" }}>{s?.tableCode || "—"}</span>
                {s?.customerName ? ` · ${s.customerName}` : ""}
              </div>
            </div>
          </Link>

          {/* Nav desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const showBadge = item.href === "/resto/cart" && cartCount > 0;
              return (
                <Link key={item.href} href={item.href}
                  className="relative px-3 py-2 rounded-xl text-sm font-medium flex items-center gap-1.5 transition-all"
                  style={{
                    background: isActive ? "rgba(0,201,184,0.12)" : "transparent",
                    border: isActive ? "1px solid rgba(0,201,184,0.25)" : "1px solid transparent",
                    color: isActive ? "#00C9B8" : "rgba(255,255,255,0.6)",
                  }}>
                  <span>{item.icon}</span>
                  {item.label}
                  {showBadge && (
                    <span className="absolute -top-1 -right-1 size-5 rounded-full text-[10px] font-bold flex items-center justify-center"
                      style={{ background: "#00C9B8", color: "#000" }}>
                      {cartCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Change table */}
          <button onClick={() => { clearSession(); router.push("/resto"); }}
            className="px-3 py-2 rounded-xl text-xs font-semibold transition hover:opacity-90 shrink-0"
            style={{ background: "rgba(0,201,184,0.1)", border: "1px solid rgba(0,201,184,0.2)", color: "#00C9B8" }}>
            Cambiar mesa
          </button>
        </div>

        {/* Mobile nav */}
        <div className="md:hidden border-t px-3 py-2 flex gap-1 overflow-x-auto"
          style={{ borderColor: "rgba(0,201,184,0.08)" }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const showBadge = item.href === "/resto/cart" && cartCount > 0;
            return (
              <Link key={item.href} href={item.href}
                className="relative px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1 whitespace-nowrap transition"
                style={{
                  background: isActive ? "rgba(0,201,184,0.12)" : "rgba(255,255,255,0.03)",
                  color: isActive ? "#00C9B8" : "rgba(255,255,255,0.5)",
                }}>
                <span>{item.icon}</span>
                {item.label}
                {showBadge && (
                  <span className="size-4 rounded-full text-[9px] font-bold flex items-center justify-center"
                    style={{ background: "#00C9B8", color: "#000" }}>
                    {cartCount}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-5 pb-16">{children}</main>
    </div>
  );
}
