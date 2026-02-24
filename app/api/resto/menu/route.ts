import { NextResponse } from "next/server";
import { getMenu } from "@/lib/restoDb";

export async function GET() {
  return NextResponse.json({ menu: getMenu() });
}
