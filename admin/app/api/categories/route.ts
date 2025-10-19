import { NextResponse } from "next/server";
import { authClient } from "@/auth-client";
import { cookies } from "next/headers";
import { removePolishChars } from "@/lib/utils";
import {
  getCategories,
  insertCategory,
  findCategoryByName,
  findCategoryBySlug,
} from "@/lib/mongo-operations";
import { randomUUID } from "crypto";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const session = await authClient.getSession({
    fetchOptions: {
      headers: {
        cookie: cookieHeader,
      },
    },
  });

  try {
    const user = session.data?.user;
    const userId = user?.id;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (user?.role !== "admin") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const body = await request.json();
    const { name, slug } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    // Tworzenie nowego zapisu w bazie danych
    const generatedSlug = removePolishChars(name)
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-");

    // const existingCategory = await prisma.category.findFirst({
    //   where: {
    //     OR: [{ slug: slug || generatedSlug }, { name: name }], // Sprawdzamy zarówno slug jak i name
    //   },
    // });

    // console.log("Existing category found:", existingCategory);

    // if (existingCategory) {
    //   return new NextResponse("Category with this name already exists", {
    //     status: 409,
    //   });
    // }
    // if (existingCategory) {
    //   return new NextResponse(
    //     `Category already exists with name "${existingCategory.name}" or slug "${existingCategory.slug}"`,
    //     {
    //       status: 409,
    //     }
    //   );
    // }

    // const category = await prisma.category.create({
    //   data: {
    //     name,
    //     slug: slug || generatedSlug,
    //   },
    // });

    const finalSlug = slug || generatedSlug;

    // Покращена перевірка на існування
    const trimmedName = name.trim();

    const existingByName = await findCategoryByName(trimmedName);

    const existingBySlug = await findCategoryBySlug(finalSlug);

    if (existingByName) {
      return new NextResponse(
        `Category with name "${existingByName.name}" already exists`,
        { status: 409 }
      );
    }

    if (existingBySlug) {
      return new NextResponse(
        `Category with slug "${existingBySlug.slug}" already exists`,
        { status: 409 }
      );
    }

    // Створення категорії
    const category = await insertCategory({
      id: randomUUID(),
      name: trimmedName,
      slug: finalSlug,
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Error adding category:", error);
    return new NextResponse("Failed to add category, Internal server error", {
      status: 500,
    });
  }
}

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// export async function PATCH(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   const cookieHeader = cookies().toString();

//   const session = await authClient.getSession({
//     fetchOptions: {
//       headers: {
//         cookie: cookieHeader,
//       },
//     },
//   });
//   try {
//     const userId = session.data?.user.id;

//     const body = await request.json();
//     const { name } = body;

//     if (!userId) {
//       return new NextResponse("Unauthenticated", { status: 401 });
//     }

//     if (!name) {
//       return new NextResponse("Name is required", { status: 400 });
//     }

//     const generatedSlug = removePolishChars(name)
//       .trim()
//       .toLowerCase()
//       .replace(/\s+/g, "-");

//     // Sprawdzamy, czy kategoria o danej nazwie już istnieje
//     const existingCategory = await prisma.category.findFirst({
//       where: {
//         AND: [
//           {
//             OR: [{ name: name }, { slug: generatedSlug }],
//           },
//           {
//             NOT: {
//               id: params.id,
//             },
//           },
//         ],
//       },
//     });

//     if (existingCategory) {
//       return new NextResponse(
//         "Category with this name or slug already exists",
//         {
//           status: 409,
//         }
//       );
//     }

//     // aktualizujemy usługę za pomocą id kategorii z params
//     const category = await prisma.category.update({
//       where: {
//         id: params.id,
//       },
//       data: {
//         name,
//         slug: generatedSlug,
//       },
//     });
//     return NextResponse.json(category);
//   } catch (error) {
//     console.log("Błąd przy zmianie kategorii", error);
//     return new NextResponse("Internal error", { status: 500 });
//   }
// }

// export async function DELETE(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     if (!params.id) {
//       return new NextResponse("Category id is required", { status: 400 });
//     }
//     const category = await prisma.category.delete({
//       where: { id: params.id },
//     });
//     return NextResponse.json(category);
//   } catch (error) {
//     console.log("[Błąd przy usunięciu usługi", error);
//     return new NextResponse("Internal error", { status: 500 });
//   }
// }
