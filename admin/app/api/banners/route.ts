import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { authClient } from "@/auth-client";
import {
  getBanners,
  insertBanner,
} from "@/lib/mongo-operations";
import { randomUUID } from "crypto";

// GET /api/banners
export async function GET() {
  try {
    const banners = await getBanners();
    return NextResponse.json(banners, { status: 200 });
  } catch (error) {
    console.error("Error fetching banners:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/banners
export async function POST(request: Request) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const session = await authClient.getSession({
    fetchOptions: { headers: { cookie: cookieHeader } },
  });

  if (!session.data?.user || session.data.user.role !== "admin") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { title, description, ctaText, ctaLink, imageUrl } =
      await request.json();

    if (!title || !imageUrl) {
      return new NextResponse("imageUrl and title are required", {
        status: 400,
      });
    }

    const newBanner = await insertBanner({
      id: randomUUID(),
      title,
      description: description || undefined,
      ctaText: ctaText || undefined,
      ctaLink: ctaLink || undefined,
      imageUrl,
    });

    return NextResponse.json(newBanner, { status: 201 });
  } catch (error) {
    console.error("Error creating banner:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
