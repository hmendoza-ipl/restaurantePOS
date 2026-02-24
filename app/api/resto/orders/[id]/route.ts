import { NextResponse } from "next/server";
import { getOrder, computeTotal, markPaid, closeOrder, addItems } from "@/lib/restoDb";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const order = getOrder(params.id);
  if (!order) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ order, total: computeTotal(order) });
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const order = addItems(params.id, body.items || []);
  if (!order) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ order });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  if (body.action === "pay") {
    const order = markPaid(params.id);
    if (!order) return NextResponse.json({ error: "not found" }, { status: 404 });
    return NextResponse.json({ order });
  }
  if (body.action === "close") {
    const order = closeOrder(params.id);
    if (!order) return NextResponse.json({ error: "not found" }, { status: 404 });
    return NextResponse.json({ order });
  }
  return NextResponse.json({ error: "unknown action" }, { status: 400 });
}
