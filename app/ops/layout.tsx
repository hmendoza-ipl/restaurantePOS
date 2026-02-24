import Image from "next/image";
import Link from "next/link";

const navItems = [
  { href: "/ops", label: "Manager", icon: "📊" },
  { href: "/ops/kitchen", label: "Cocina", icon: "🍳" },
  { href: "/ops/bar", label: "Bar", icon: "🍹" },
];

export default function OpsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b backdrop-blur-xl"
        style={{ borderColor: "rgba(0,201,184,0.12)", background: "rgba(13,17,23,0.9)" }}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 blur-lg rounded-full" style={{ background: "rgba(0,201,184,0.3)" }} />
              <Image src="/logo.png" alt="DinerFlow" width={32} height={32} className="relative rounded-full" />
            </div>
            <div>
              <div className="font-bold text-sm">
                <span style={{ background: "linear-gradient(135deg, #00C9B8, #0A6EBD)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>DinerFlow</span>
                <span className="text-white"> · Ops</span>
              </div>
              <div className="text-[10px] text-white/40 font-mono">Panel de operaciones</div>
            </div>
          </div>

          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}
                className="px-3 py-2 rounded-xl text-sm font-medium flex items-center gap-1.5 transition border"
                style={{ borderColor: "rgba(0,201,184,0.15)", background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.7)" }}>
                <span>{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>

          <Link href="/resto"
            className="px-3 py-2 rounded-xl text-xs font-medium transition border"
            style={{ borderColor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.4)" }}>
            Ver módulo cliente →
          </Link>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-5">{children}</main>
    </div>
  );
}
