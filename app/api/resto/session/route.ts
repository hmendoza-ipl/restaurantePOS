import { NextResponse } from "next/server";
import { getOrCreateOpenOrder } from "@/lib/restoDb";

export async function POST(req: Request) {
  const { tableCode, customerName } = await req.json();
  if (!tableCode) return NextResponse.json({ error: "tableCode required" }, { status: 400 });
  const order = getOrCreateOpenOrder(tableCode, customerName);
  return NextResponse.json({ order });
}
