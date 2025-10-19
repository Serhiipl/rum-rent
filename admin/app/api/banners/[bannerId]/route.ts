import { NextResponse } from "next/server";
import {
  getBannerById,
  updateBannerDoc,
  deleteBannerDoc,
} from "@/lib/mongo-operations";

export async function PATCH(
  request: Request,
  params: { params: Promise<{ bannerId: string }> }
) {
  try {
    const body = await request.json();
    const { title, description, ctaText, ctaLink, imageUrl } = body;

    // Отримати serviceId з асинхронного params
    const { bannerId } = await params.params;

    if (!bannerId) {
      return new NextResponse("Banner ID is required", { status: 400 });
    }

    const existing = await getBannerById(bannerId);
    if (!existing) {
      return new NextResponse("Banner not found", { status: 404 });
    }

    await updateBannerDoc(bannerId, {
      title,
      description: description ?? null,
      ctaText: ctaText ?? null,
      ctaLink: ctaLink ?? null,
      imageUrl,
    });

    const banner = await getBannerById(bannerId);

    return NextResponse.json(banner, { status: 200 });
  } catch (error) {
    console.error("Error updating banner:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
export async function DELETE(
  request: Request,
  params: { params: Promise<{ bannerId: string }> }
) {
  try {
    const { bannerId } = await params.params;

    if (!params || !params.params) {
      return NextResponse.json("Invalid request format", { status: 400 });
    }

    if (!bannerId) {
      return NextResponse.json("Service ID is required", { status: 400 });
    }

    const existing = await getBannerById(bannerId);
    if (!existing) {
      return NextResponse.json("Banner not found", { status: 404 });
    }

    await deleteBannerDoc(bannerId);

    return NextResponse.json(existing, { status: 200 });
  } catch (error) {
    console.error("Error deleting banner:", error);
    return NextResponse.json("Internal server error", { status: 500 });
  }
}
