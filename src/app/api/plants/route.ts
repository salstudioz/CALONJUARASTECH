import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PLANTS } from "@/data/agronomy";

export async function GET() {
  try {
    const plants = await prisma.plant.findMany({
      include: {
        diseases: true,
        dose_references: true,
      },
    });

    if (plants && plants.length > 0) {
      return NextResponse.json({
        source: "database",
        data: plants,
      });
    }
  } catch (error) {
    // Graceful fallback to static data if database is not active
    console.warn("Prisma DB not connected, using static reference:", error);
  }

  return NextResponse.json({
    source: "static_reference",
    data: Object.values(PLANTS),
  });
}
