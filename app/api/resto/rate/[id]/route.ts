import { NextResponse } from "next/server";
import { rateOrder } from "@/lib/restoDb";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { stars, comment } = await req.json();
  const order = rateOrder(params.id, Number(stars || 5), comment);
  if (!order) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ order });
}
