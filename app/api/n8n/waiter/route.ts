import { NextResponse } from "next/server";
import { getOrder } from "@/lib/restoDb";

const fallbacks = [
  "¡Claro! Te recomiendo el **Avocado Toast** si buscas algo ligero y saludable, o la **Hamburguesa Classic** si tienes buen apetito. Para acompañar, nuestro **Latte Vainilla** es el favorito de la casa. 😊",
  "Para opciones sin lácteos, el **Avocado Toast** y los **Tacos al Pastor** son perfectos. En bebidas, el **Agua de Jamaica** o el **Mojito** son excelentes opciones.",
  "Nuestros platos más populares hoy son la **Hamburguesa Classic** y los **Tacos al Pastor**. ¿Tienes alguna alergia o preferencia especial que deba saber?",
  "Para postres te recomiendo el **Cheesecake** (sin gluten) o el **Tiramisú** para algo más intenso. ¿Te gustaría saber el maridaje ideal con tu platillo principal?",
  "¡Buena elección! El **Capuccino** y el **Latte Vainilla** son preparados con granos de origen. ¿Prefieres leche de avena o almendra en lugar de leche entera?",
];

export async function POST(req: Request) {
  const { orderId, question } = await req.json();
  const order = orderId ? getOrder(orderId) : null;
  const webhook = process.env.N8N_WAITER_WEBHOOK_URL || process.env.N8N_AI_WEBHOOK_URL;

  if (!webhook) {
    const reply = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    return NextResponse.json({ reply, meta: { mode: "fallback" } });
  }

  const payload = {
    context: {
      tableCode: order?.tableCode,
      orderId,
      items: order?.items?.map(i => ({ name: i.name, qty: i.qty, status: i.status })) || [],
    },
    question,
  };

  try {
    const r = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await r.json().catch(() => ({}));
    return NextResponse.json({ reply: data.reply || "¿Te ayudo con algo más?", meta: data.meta || {} });
  } catch {
    return NextResponse.json({ reply: "Lo siento, el mesero IA está fuera de línea momentáneamente. ¿En qué más te puedo ayudar?", meta: { mode: "error" } });
  }
}
