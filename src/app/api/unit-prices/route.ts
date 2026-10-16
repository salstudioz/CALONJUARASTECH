import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { DEFAULT_UNIT_PRICES } from "@/lib/calculations";

export async function GET() {
  try {
    const dbPrices = await prisma.unitPrice.findMany({
      orderBy: { id: "asc" },
    });

    if (dbPrices.length > 0) {
      return NextResponse.json({
        success: true,
        source: "database",
        data: dbPrices,
      });
    }

    // Fallback jika tabel database masih kosong
    return NextResponse.json({
      success: true,
      source: "defaults",
      data: Object.entries(DEFAULT_UNIT_PRICES).map(([key, val], idx) => ({
        id: idx + 1,
        item_name: key.replace(/_/g, " "),
        price_per_unit: val,
      })),
    });
  } catch (error) {
    // Fallback saat MySQL belum dinyalakan
    return NextResponse.json({
      success: true,
      source: "fallback_defaults",
      data: Object.entries(DEFAULT_UNIT_PRICES).map(([key, val], idx) => ({
        id: idx + 1,
        item_name: key.replace(/_/g, " "),
        price_per_unit: val,
      })),
    });
  }
}
