import { NextResponse } from "next/server";
import { getMongoDb } from "@/lib/mongodb";

export const runtime = "nodejs";
export const revalidate = 90; // 1,5 minutes

// Function to validate and sanitize URLs

const isSafeHttpUrl = (value: string | null | undefined) => {
  if (!value) return false;
  try {
    const trimmed = value.trim();
    if (!trimmed) return false;
    if (trimmed.startsWith("/")) return true;
    const parsed = new URL(
      trimmed,
      process.env.NEXT_PUBLIC_BASE_URL || "https://example.com"
    );
    return parsed.protocol === "https:";
  } catch {
    return false;
  }
};
// GET /api/banners

export async function GET() {
  try {
    const db = await getMongoDb();
    const banners = await db
      .collection("Banner")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    const sanitized = banners.map((banner) => {
      const { _id, ...rest } = banner as {
        _id: unknown;
        imageUrl: string;
        ctaLink?: string | null;
      } & Record<string, unknown>;
      const imageUrl = isSafeHttpUrl(rest.imageUrl)
        ? rest.imageUrl.trim()
        : "";
      const ctaLink = isSafeHttpUrl(rest.ctaLink)
        ? rest.ctaLink?.trim()
        : undefined;
      return {
        id: String(_id),
        ...rest,
        imageUrl,
        ctaLink,
      };
    });
    const res = NextResponse.json(sanitized, { status: 200 });
    // Cache for 3 minutes, allow stale content while revalidating for 5 minutes
    res.headers.set(
      "Cache-Control",
      "public, max-age=180, s-maxage=180, stale-while-revalidate=300"
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
