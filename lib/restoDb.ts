import { randomUUID } from "crypto";

export type MenuCategory = "Cafés" | "Desayunos" | "Entradas" | "Platos" | "Postres" | "Bebidas" | "Cocteles";

export type MenuItem = {
  id: string;
  name: string;
  category: MenuCategory;
  price: number;
  description: string;
  imageUrl: string;
  tags?: string[];
  options?: { name: string; values: string[] }[];
};

export type OrderItemStatus = "queued" | "preparing" | "ready" | "served";
export type OrderItem = {
  id: string;
  menuItemId: string;
  name: string;
  qty: number;
  unitPrice: number;
  notes?: string;
  chosen?: Record<string, string>;
  station: "kitchen" | "bar";
  status: OrderItemStatus;
};

export type OrderStatus = "open" | "paid" | "closed";

export type Order = {
  id: string;
  restaurantId: string;
  tableCode: string;
  customerName?: string;
  items: OrderItem[];
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
  rating?: { stars: number; comment?: string };
};

const now = () => new Date().toISOString();

const g = globalThis as any;
if (!g.__resto_demo_db) {
  const menu: MenuItem[] = [
    {
      id: "m1",
      name: "Latte Vainilla",
      category: "Cafés",
      price: 65,
      description: "Espresso + leche vaporizada + vainilla orgánica.",
      imageUrl: "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=800&auto=format&fit=crop",
      options: [
        { name: "Tamaño", values: ["Chico", "Mediano", "Grande"] },
        { name: "Leche", values: ["Entera", "Deslactosada", "Avena", "Almendra"] },
      ],
      tags: ["Recomendado"],
    },
    {
      id: "m2",
      name: "Capuccino",
      category: "Cafés",
      price: 58,
      description: "Cremoso y balanceado, con espuma densa italiana.",
      imageUrl: "https://images.unsplash.com/photo-1512568400610-62da28bc8a13?q=80&w=800&auto=format&fit=crop",
      options: [{ name: "Tamaño", values: ["Chico", "Mediano", "Grande"] }],
    },
    {
      id: "m3",
      name: "Avocado Toast",
      category: "Desayunos",
      price: 120,
      description: "Pan artesanal de masa madre, aguacate, aceite de oliva y limón.",
      imageUrl: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=800&auto=format&fit=crop",
      options: [{ name: "Extras", values: ["Huevo pochado", "Tocino crujiente", "Queso feta"] }],
      tags: ["Vegano"],
    },
    {
      id: "m4",
      name: "Hamburguesa Classic",
      category: "Platos",
      price: 189,
      description: "Carne angus 150g, queso gouda, lechuga, jitomate, papas crinkle.",
      imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop",
      options: [
        { name: "Término", values: ["¾ cocida", "Bien cocida"] },
        { name: "Sin", values: ["Cebolla", "Pepinillos", "Mayonesa"] },
      ],
      tags: ["Popular"],
    },
    {
      id: "m5",
      name: "Ensalada César",
      category: "Entradas",
      price: 98,
      description: "Lechuga romana, crutones, parmesano, aderezo César casero.",
      imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop",
      options: [{ name: "Proteína", values: ["Sin proteína", "Pollo grillado", "Camarón"] }],
    },
    {
      id: "m6",
      name: "Margarita Clásica",
      category: "Cocteles",
      price: 140,
      description: "Tequila blanco, triple sec, jugo de limón fresco. El clásico.",
      imageUrl: "https://images.unsplash.com/photo-1544145945-f90425340c7e?q=80&w=800&auto=format&fit=crop",
      options: [
        { name: "Sal", values: ["Con sal", "Sin sal"] },
        { name: "Tipo", values: ["Frozen", "On the rocks"] },
      ],
      tags: ["Recomendado"],
    },
    {
      id: "m7",
      name: "Agua Fresca",
      category: "Bebidas",
      price: 45,
      description: "Jamaica, horchata o limón con chía. Del día.",
      imageUrl: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?q=80&w=800&auto=format&fit=crop",
      options: [{ name: "Sabor", values: ["Jamaica", "Horchata", "Limón chía"] }],
    },
    {
      id: "m8",
      name: "Cheesecake",
      category: "Postres",
      price: 95,
      description: "Cremoso NY style, con coulis de frutos rojos y menta fresca.",
      imageUrl: "https://images.unsplash.com/photo-1505252585461-04db1eb84625?q=80&w=800&auto=format&fit=crop",
      tags: ["Sin gluten"],
    },
    {
      id: "m9",
      name: "Tacos al Pastor",
      category: "Entradas",
      price: 105,
      description: "3 tacos, carne de cerdo marinada, piña, cilantro, cebolla.",
      imageUrl: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?q=80&w=800&auto=format&fit=crop",
      options: [{ name: "Salsa", values: ["Verde", "Roja", "Ambas"] }],
      tags: ["Popular"],
    },
    {
      id: "m10",
      name: "Mojito",
      category: "Cocteles",
      price: 125,
      description: "Ron blanco, menta fresca, limón, azúcar morena, soda.",
      imageUrl: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?q=80&w=800&auto=format&fit=crop",
      options: [{ name: "Intensidad", values: ["Suave", "Regular", "Fuerte"] }],
    },
    {
      id: "m11",
      name: "Pasta Carbonara",
      category: "Platos",
      price: 175,
      description: "Espagueti, panceta, yema, parmesano, pimienta negra. Receta romana.",
      imageUrl: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: "m12",
      name: "Tiramisú",
      category: "Postres",
      price: 88,
      description: "Clásico italiano, con café espresso y mascarpone.",
      imageUrl: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=800&auto=format&fit=crop",
      tags: ["Favorito"],
    },
  ];

  g.__resto_demo_db = {
    restaurantId: "dinerflow_demo_1",
    menu,
    orders: [] as Order[],
  };
}

const db = g.__resto_demo_db as { restaurantId: string; menu: MenuItem[]; orders: Order[] };

export function getMenu() { return db.menu; }

export function getOrCreateOpenOrder(tableCode: string, customerName?: string) {
  let o = db.orders.find((x) => x.tableCode === tableCode && x.status === "open");
  if (!o) {
    o = {
      id: randomUUID(),
      restaurantId: db.restaurantId,
      tableCode,
      customerName,
      items: [],
      status: "open",
      createdAt: now(),
      updatedAt: now(),
    };
    db.orders.push(o);
  }
  return o;
}

export function getOrder(id: string) { return db.orders.find((x) => x.id === id) || null; }
export function listOrders() { return db.orders.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)); }

export function addItems(orderId: string, items: Array<Omit<OrderItem, "id" | "status">>) {
  const o = getOrder(orderId);
  if (!o) return null;
  for (const it of items) {
    o.items.push({ ...it, id: randomUUID(), status: "queued" });
  }
  o.updatedAt = now();
  return o;
}

export function setItemStatus(orderId: string, orderItemId: string, status: OrderItemStatus) {
  const o = getOrder(orderId);
  if (!o) return null;
  const item = o.items.find((i) => i.id === orderItemId);
  if (!item) return null;
  item.status = status;
  o.updatedAt = now();
  return o;
}

export function computeTotal(order: Order) {
  return order.items.reduce((sum, i) => sum + i.qty * i.unitPrice, 0);
}

export function markPaid(orderId: string) {
  const o = getOrder(orderId);
  if (!o) return null;
  o.status = "paid";
  o.paidAt = now();
  o.updatedAt = now();
  return o;
}

export function closeOrder(orderId: string) {
  const o = getOrder(orderId);
  if (!o) return null;
  o.status = "closed";
  o.updatedAt = now();
  return o;
}

export function rateOrder(orderId: string, stars: number, comment?: string) {
  const o = getOrder(orderId);
  if (!o) return null;
  o.rating = { stars, comment };
  o.updatedAt = now();
  return o;
}
