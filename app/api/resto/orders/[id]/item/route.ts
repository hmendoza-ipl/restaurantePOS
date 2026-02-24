import { NextResponse } from "next/server";
import { setItemStatus } from "@/lib/restoDb";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { orderItemId, status } = await req.json();
  const order = setItemStatus(params.id, orderItemId, status);
  if (!order) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ order });
}
