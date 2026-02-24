import { NextResponse } from "next/server";
import { getOrder, computeTotal } from "@/lib/restoDb";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const order = getOrder(params.id);
  if (!order) return new NextResponse("Not found", { status: 404 });

  const total = computeTotal(order);
  const subtotal = total / 1.16;
  const iva = total - subtotal;

  const html = `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Recibo DinerFlow AI</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', system-ui, sans-serif; background: #f9fafb; color: #111; padding: 32px; }
    .card { background: #fff; border-radius: 16px; padding: 32px; max-width: 480px; margin: 0 auto; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { text-align: center; margin-bottom: 24px; border-bottom: 2px solid #f0f0f0; padding-bottom: 20px; }
    .logo-text { font-size: 22px; font-weight: 800; background: linear-gradient(135deg, #00C9B8, #0A6EBD); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .tagline { font-size: 11px; color: #888; margin-top: 2px; }
    .meta { display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 12px; color: #666; gap: 10px; }
    .meta b { color: #111; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
    th { text-align: left; font-size: 11px; text-transform: uppercase; color: #888; padding: 6px 4px; border-bottom: 1px solid #eee; }
    td { padding: 8px 4px; font-size: 13px; border-bottom: 1px solid #f5f5f5; }
    td:last-child { text-align: right; }
    .totals { border-top: 2px solid #eee; padding-top: 12px; space-y: 4px; }
    .total-row { display: flex; justify-content: space-between; font-size: 13px; color: #555; margin-bottom: 4px; }
    .total-final { display: flex; justify-content: space-between; font-size: 18px; font-weight: 800; color: #111; margin-top: 8px; }
    .footer { text-align: center; margin-top: 24px; font-size: 11px; color: #aaa; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
    .badge-paid { background: #dcfce7; color: #16a34a; }
    .badge-open { background: #fef9c3; color: #ca8a04; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="logo-text">DinerFlow AI</div>
      <div class="tagline">Smart Dining. Seamless Service.</div>
      <div style="margin-top:12px">
        <span class="badge ${order.status === 'paid' || order.status === 'closed' ? 'badge-paid' : 'badge-open'}">
          ${order.status === 'paid' || order.status === 'closed' ? '✓ PAGADO' : '⏳ PENDIENTE'}
        </span>
      </div>
    </div>

    <div class="meta">
      <div><div>Mesa</div><b>${order.tableCode}</b></div>
      <div><div>Orden</div><b>${order.id.slice(0,8).toUpperCase()}</b></div>
      <div><div>Fecha</div><b>${new Date(order.createdAt).toLocaleDateString('es-MX')}</b></div>
      <div><div>Hora</div><b>${new Date(order.createdAt).toLocaleTimeString('es-MX', {hour:'2-digit', minute:'2-digit'})}</b></div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Cant.</th>
          <th>Producto</th>
          <th>P/U</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        ${order.items.map(i => `
        <tr>
          <td>${i.qty}</td>
          <td>
            ${i.name}
            ${i.chosen && Object.values(i.chosen).some(Boolean) ? `<br><small style="color:#888">${Object.entries(i.chosen).filter(([,v])=>v).map(([k,v])=>`${k}: ${v}`).join(', ')}</small>` : ''}
            ${i.notes ? `<br><small style="color:#888">Nota: ${i.notes}</small>` : ''}
          </td>
          <td>$${i.unitPrice.toFixed(2)}</td>
          <td>$${(i.qty*i.unitPrice).toFixed(2)}</td>
        </tr>`).join('')}
      </tbody>
    </table>

    <div class="totals">
      <div class="total-row"><span>Subtotal</span><span>$${subtotal.toFixed(2)}</span></div>
      <div class="total-row"><span>IVA (16%)</span><span>$${iva.toFixed(2)}</span></div>
      <div class="total-final"><span>TOTAL</span><span>$${total.toFixed(2)} MXN</span></div>
    </div>

    <div class="footer">
      <p>Gracias por tu visita 🙌</p>
      <p style="margin-top:6px">Este documento es un comprobante demo.</p>
      <p>En producción: CFDI real + firma digital.</p>
    </div>
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
