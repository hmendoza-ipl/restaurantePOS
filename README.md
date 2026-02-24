# 🍽️ DinerFlow AI — Smart Dining Demo

**Smart Dining. Seamless Service.**

Sistema completo de pedidos por QR, cocina/bar en tiempo real, mesero IA con n8n y dashboard de gerente.

## 🚀 Inicio rápido

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## 🗺️ Rutas

| Ruta | Descripción |
|------|-------------|
| `/` | Landing page |
| `/resto` | Entrada por código de mesa |
| `/resto/menu` | Menú con fotos y opciones |
| `/resto/cart` | Carrito de pedido |
| `/resto/order` | Estado en tiempo real (cocina/bar) |
| `/resto/chat` | Mesero IA |
| `/resto/pay` | Pagar + factura |
| `/resto/rate` | Calificar y cerrar cuenta |
| `/ops` | Dashboard del manager |
| `/ops/kitchen` | Kitchen Display System |
| `/ops/bar` | Bar Screen |

## 🧪 Flujo demo

1. Ve a `/resto` → ingresa código de mesa (ej: `T12`)
2. Agrega items al menú → carrito → confirmar pedido
3. **En otra pestaña**: `/ops/kitchen` o `/ops/bar`
4. Cambia estados: En cola → Preparando → Listo → Servido
5. Mira cómo se actualiza en `/resto/order` (polling 1.2s)
6. Paga en `/resto/pay` → factura → califica → cerrar

## 🤖 Webhook n8n (Mesero IA)

El endpoint `/api/n8n/waiter` recibe:

```json
{
  "context": {
    "tableCode": "T12",
    "orderId": "uuid...",
    "items": [{ "name": "Latte", "qty": 1, "status": "queued" }]
  },
  "question": "¿Qué recomiendas sin lácteos?"
}
```

Espera respuesta:
```json
{ "reply": "Te recomiendo el Avocado Toast y un Americano con leche de avena." }
```

Sin webhook configurado, usa respuestas de fallback inteligentes.

## 📦 Deploy en servidor

```bash
# Build + PM2
npm run build
pm2 start npm --name "dinerflow" -- start

# Nginx config
server {
    listen 80;
    server_name tu-dominio.com;
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
    }
}

# SSL
certbot --nginx -d tu-dominio.com
```

## 🐳 Docker

```bash
docker build -t dinerflow .
docker run -p 3000:3000 --env-file .env.local dinerflow
```

---
DinerFlow AI · Qubica.AI
