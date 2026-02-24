import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DinerFlow AI — Smart Dining",
  description: "Smart Dining. Seamless Service.",
  icons: { icon: "/logo.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen antialiased" style={{ background: "#0D1117" }}>
        {/* Global ambient background */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div style={{
            position:"absolute", inset:0,
            background: "radial-gradient(ellipse 80% 50% at 10% 0%, rgba(0,201,184,0.12) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 90% 20%, rgba(10,110,189,0.16) 0%, transparent 55%), radial-gradient(ellipse 50% 60% at 50% 100%, rgba(0,168,181,0.06) 0%, transparent 60%)"
          }}/>
          {/* Subtle grid */}
          <div style={{
            position:"absolute", inset:0, opacity:0.04,
            backgroundImage: "linear-gradient(rgba(0,201,184,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,201,184,0.5) 1px, transparent 1px)",
            backgroundSize: "52px 52px"
          }}/>
          {/* Top glow line */}
          <div style={{ position:"absolute", top:0, left:0, right:0, height:"1px", background:"linear-gradient(90deg, transparent, rgba(0,201,184,0.4), transparent)" }}/>
        </div>
        {children}
      </body>
    </html>
  );
}
