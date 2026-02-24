import Image from "next/image";
import Link from "next/link";

export default function Landing() {
  const flow = [
    { step: "01", icon: "📱", title: "Escanea QR", desc: "El comensal escanea el código de su mesa" },
    { step: "02", icon: "🍽️", title: "Elige del menú", desc: "Fotos HD, filtros, opciones personalizadas" },
    { step: "03", icon: "⚡", title: "Pedido directo", desc: "Va directo a cocina y bar en tiempo real" },
    { step: "04", icon: "🤖", title: "IA Mesero", desc: "Recomendaciones, alérgenos, maridaje" },
    { step: "05", icon: "💳", title: "Pago en mesa", desc: "Paga sin esperar, factura al instante" },
    { step: "06", icon: "⭐", title: "Calificación", desc: "Feedback instantáneo al gerente" },
  ];

  const features = [
    { icon: "🍳", label: "Kitchen Display" },
    { icon: "🍹", label: "Bar Screen" },
    { icon: "📊", label: "Manager Dashboard" },
    { icon: "🤖", label: "IA Mesero (n8n)" },
    { icon: "🧾", label: "Factura / CFDI" },
    { icon: "⏱️", label: "Estado en tiempo real" },
  ];

  return (
    <main className="min-h-screen flex flex-col">
      {/* Hero */}
      <section className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-5xl w-full text-center">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 blur-2xl rounded-full" style={{ background: "rgba(0,201,184,0.25)" }} />
              <Image src="/logo.png" alt="DinerFlow AI" width={120} height={120} className="relative rounded-full shadow-2xl" />
            </div>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-6"
            style={{ borderColor: "rgba(0,201,184,0.3)", background: "rgba(0,201,184,0.07)" }}>
            <span className="size-2 rounded-full animate-pulse" style={{ background: "#00C9B8" }} />
            <span className="text-xs font-mono" style={{ color: "#00C9B8" }}>DEMO EN VIVO · Smart Dining System</span>
          </div>

          <h1 className="text-6xl sm:text-7xl font-extrabold leading-none tracking-tight mb-4">
            <span style={{ background: "linear-gradient(135deg, #00C9B8 0%, #0A6EBD 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              DinerFlow
            </span>
            <span className="text-white"> AI</span>
          </h1>

          <p className="text-xl text-white/50 font-light mb-2">Smart Dining. Seamless Service.</p>
          <p className="text-white/40 max-w-xl mx-auto text-sm leading-relaxed mb-10">
            Sistema completo de pedidos por QR, cocina/bar en tiempo real, mesero IA con n8n y dashboard de gerente.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
            <Link href="/resto" className="group px-7 py-3.5 rounded-2xl font-bold text-sm flex items-center gap-2 transition hover:opacity-90 shadow-lg"
              style={{ background: "linear-gradient(135deg, #00C9B8, #0A6EBD)", boxShadow: "0 0 30px rgba(0,201,184,0.3)" }}>
              🍽️ Módulo Cliente
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <Link href="/ops" className="px-7 py-3.5 rounded-2xl font-semibold text-sm transition"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(0,201,184,0.2)" }}>
              ⚙️ Panel Ops / Manager
            </Link>
            <Link href="/ops/kitchen" className="px-7 py-3.5 rounded-2xl font-semibold text-sm transition"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              🍳 Kitchen Screen
            </Link>
          </div>

          {/* Flow steps */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-12">
            {flow.map((f) => (
              <div key={f.step} className="rounded-2xl p-4 text-left transition"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(0,201,184,0.08)" }}>
                <div className="text-xs font-mono mb-2" style={{ color: "#00C9B8" }}>{f.step}</div>
                <div className="text-2xl mb-2">{f.icon}</div>
                <div className="font-semibold text-sm">{f.title}</div>
                <div className="text-xs text-white/40 mt-1 leading-relaxed">{f.desc}</div>
              </div>
            ))}
          </div>

          {/* Feature chips */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {features.map((f) => (
              <div key={f.label} className="px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5"
                style={{ background: "rgba(0,201,184,0.08)", border: "1px solid rgba(0,201,184,0.15)", color: "rgba(255,255,255,0.7)" }}>
                <span>{f.icon}</span>{f.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t py-4 px-6 text-center text-xs text-white/20 font-mono"
        style={{ borderColor: "rgba(0,201,184,0.1)" }}>
        DinerFlow AI · Demo v1.0 · Powered by Qubica.AI
      </footer>
    </main>
  );
}
