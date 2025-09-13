import { NextResponse } from "next/server";
// import { getBanners } from "@/lib/prisma-operations";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

// export async function GET() {
//   try {
//     const banners = await getBanners();
//     return NextResponse.json(banners, { status: 200 });
//   } catch (e) {
//     console.error("GET /api/banners error", e);
//     return NextResponse.json({ error: "Failed to load banners" }, { status: 500 });
//   }
// }

export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(banners, { status: 200 });
  } catch (error) {
    console.error("Error fetching banners:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
