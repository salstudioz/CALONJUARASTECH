import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DEFAULT_PRICES } from "@/data/agronomy";

export async function GET() {
  try {
    const prices = await prisma.unitPrice.findMany();
    if (prices && prices.length > 0) {
      return NextResponse.json({
        source: "database",
        data: prices,
      });
    }
  } catch (error) {
    console.warn("Prisma DB not connected, falling back to static default prices:", error);
  }

  return NextResponse.json({
    source: "static_reference",
    data: DEFAULT_PRICES,
  });
}
