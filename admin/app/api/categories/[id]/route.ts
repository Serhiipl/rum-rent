import { NextResponse } from "next/server";
import { removePolishChars } from "@/lib/utils";
import {
  getCategoryById,
  updateCategoryDoc,
  findCategoryByName,
  findCategoryBySlug,
  deleteCategoryDoc,
  categoryUsedByService,
  categoryHasChildren,
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

    let normalizedParentId = currentCategory.parentId ?? null;
    const parentProvided = Object.prototype.hasOwnProperty.call(
      body,
      "parentId"
    );

    if (parentProvided) {
      const rawParentId = body.parentId;
      if (typeof rawParentId === "string" && rawParentId.trim().length > 0) {
        const parentId = rawParentId.trim();
        if (parentId === id) {
          return new NextResponse("Category cannot be its own parent", {
            status: 400,
          });
        }
        const parentCategory = await getCategoryById(parentId);
        if (!parentCategory) {
          return new NextResponse("Parent category not found", {
            status: 400,
          });
        }

        // Detect circular references by traversing ancestor chain
        let ancestorId = parentCategory.parentId ?? null;
        while (ancestorId) {
          if (ancestorId === id) {
            return new NextResponse(
              "Cannot assign a child category as parent",
              { status: 400 }
            );
          }
          const ancestorCategory = await getCategoryById(ancestorId);
          if (!ancestorCategory) {
            break;
          }
          ancestorId = ancestorCategory.parentId ?? null;
        }

        normalizedParentId = parentCategory.id;
      } else {
        normalizedParentId = null;
      }
    }

    await updateCategoryDoc(id, {
      name: trimmedName,
      slug: generatedSlug,
      ...(parentProvided ? { parentId: normalizedParentId } : {}),
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

    const hasChildren = await categoryHasChildren(id);
    if (hasChildren) {
      return new NextResponse(
        "Cannot delete category because it has subcategories",
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
