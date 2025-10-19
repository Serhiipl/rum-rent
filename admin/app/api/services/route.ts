import { NextResponse } from "next/server";
import { authClient } from "@/auth-client";
import { cookies } from "next/headers";
import {
  getServices,
  insertService,
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
    const {
      name,
      description,
      rentalPrice,
      rentalPeriod,
      deposit,
      quantity,
      condition,
      available,
      images,
      categoryId,
    } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!description) {
      return new NextResponse("Description is required", { status: 400 });
    }
    if (rentalPrice == null) {
      return new NextResponse("Rental price is required", { status: 400 });
    }
    if (!rentalPeriod) {
      return new NextResponse("Rental period is required", { status: 400 });
    }
    if (deposit == null) {
      return new NextResponse("Deposit is required", { status: 400 });
    }
    if (quantity == null) {
      return new NextResponse("Quantity is required", { status: 400 });
    }
    if (!condition) {
      return new NextResponse("Condition is required", { status: 400 });
    }

    const serviceId = randomUUID();

    const normalizedImages =
      Array.isArray(images) && images.length > 0
        ? images
            .filter(
              (image: { url?: string }) =>
                typeof image?.url === "string" && image.url.trim() !== ""
            )
            .map((image: { url: string }) => ({
              id: randomUUID(),
              url: image.url.trim(),
            }))
        : [];

    const normalizedCategoryId =
      typeof categoryId === "string" && categoryId.trim() !== ""
        ? categoryId.trim()
        : undefined;

    const service = await insertService({
      serviceId,
      name,
      description,
      rentalPrice,
      rentalPeriod,
      deposit,
      quantity,
      condition,
      available: typeof available === "boolean" ? available : true,
      categoryId: normalizedCategoryId,
      images: normalizedImages,
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error("Error adding service:", error);
    return new NextResponse("Failed to add service, Internal server error", {
      status: 500,
    });
  }
}

export async function GET() {
  try {
    const services = await getServices();
    return NextResponse.json(services, { status: 200 });
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}

// export async function PATCH(
//   request: Request,
//   { params }: { params: { serviceId: string } }
// ) {
//   try {
//     const userId = authClient.useSession();
//     const body = await request.json();
//     const { name, description, price, duration, active } = body;

//     if (!userId) {
//       return new NextResponse("Unauthenticated", { status: 401 });
//     }

//     if (!name) {
//       return new NextResponse("Name is required", { status: 400 });
//     }
//     if (!description) {
//       return new NextResponse("Description is required", { status: 400 });
//     }
//     if (price == null) {
//       return new NextResponse("Price is required", { status: 400 });
//     }
//     if (!duration) {
//       return new NextResponse("Time is required", { status: 400 });
//     }
//     // aktualizujemy usługę za pomocą serviceId z params
//     const service = await prisma.service.update({
//       where: {
//         serviceId: params.serviceId,
//       },
//       data: {
//         name,
//         description,
//         price,
//         duration,
//         active,
//       },
//     });
//     return NextResponse.json(service);
//   } catch (error) {
//     console.log("[Błąd przy zmianie usługi", error);
//     return new NextResponse("Internal error", { status: 500 });
//   }
// }

// export async function DELETE(
//   request: Request,
//   { params }: { params: { serviceId: string } }
// ) {
//   try {
//     if (!params.serviceId) {
//       return new NextResponse("Service id is required", { status: 400 });
//     }
//     const service = await prisma.service.delete({
//       where: { serviceId: params.serviceId },
//     });
//     return NextResponse.json(service);
//   } catch (error) {
//     console.log("[Błąd przy usunięciu usługi", error);
//     return new NextResponse("Internal error", { status: 500 });
//   }
// }
