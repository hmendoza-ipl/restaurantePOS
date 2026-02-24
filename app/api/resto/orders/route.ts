import { NextResponse } from "next/server";
import { listOrders } from "@/lib/restoDb";

export async function GET() {
  return NextResponse.json({ orders: listOrders() });
}
