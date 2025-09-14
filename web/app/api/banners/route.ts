import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";
export const revalidate = 300; // 5 minutes

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
    const res = NextResponse.json(banners, { status: 200 });
    res.headers.set(
      "Cache-Control",
      "public, max-age=300, s-maxage=300, stale-while-revalidate=86400"
    );
    return res;
  } catch (error) {
    console.error("Error fetching banners:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
