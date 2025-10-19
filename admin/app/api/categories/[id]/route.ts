import { NextResponse } from "next/server";
import { removePolishChars } from "@/lib/utils";
import {
  getCategoryById,
  updateCategoryDoc,
  findCategoryByName,
  findCategoryBySlug,
  deleteCategoryDoc,
  categoryUsedByService,
} from "@/lib/mongo-operations";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return new NextResponse("All fields are required", { status: 400 });
    }

    const generatedSlug = removePolishChars(name)
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-");

    const trimmedName = name.trim();

    const existingByName = await findCategoryByName(trimmedName);
    if (existingByName && existingByName.id !== id) {
      return new NextResponse(
        "Category with this name or slug already exists",
        {
          status: 409,
        }
      );
    }

    const existingBySlug = await findCategoryBySlug(generatedSlug);
    if (existingBySlug && existingBySlug.id !== id) {
      return new NextResponse(
        "Category with this name or slug already exists",
        {
          status: 409,
        }
      );
    }

    const currentCategory = await getCategoryById(id);
    if (!currentCategory) {
      return new NextResponse("Category not found", { status: 404 });
    }

    await updateCategoryDoc(id, {
      name: trimmedName,
      slug: generatedSlug,
    });

    const category = await getCategoryById(id);

    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    console.error("Error updating category:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return new NextResponse("Category ID is required", { status: 400 });
    }

    const existing = await getCategoryById(id);
    if (!existing) {
      return new NextResponse("Category not found", { status: 404 });
    }

    const servicesUsingCategory = await categoryUsedByService(id);

    if (servicesUsingCategory) {
      return new NextResponse(
        "Cannot delete category because it is used in services",
        { status: 409 }
      );
    }

    await deleteCategoryDoc(id);

    return NextResponse.json(existing, { status: 200 });
  } catch (error) {
    console.error("Error deleting category:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
