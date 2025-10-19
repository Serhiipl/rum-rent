import { NextResponse } from "next/server";
import { authClient } from "@/auth-client";
import { cookies } from "next/headers";
import {
  getServiceById,
  updateServiceDoc,
  deleteServiceDoc,
} from "@/lib/mongo-operations";

interface RouteParams {
  params: Promise<{ serviceId: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { serviceId } = await params;

    const service = await getServiceById(serviceId);

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json(service, { status: 200 });
  } catch (error) {
    console.error("Error fetching service:", error);
    return NextResponse.json(
      { error: "Failed to fetch service" },
      { status: 500 }
    );
  }
}

// export async function PATCH(
//   request: Request,
//   params: { params: Promise<{ serviceId: string }> }
// ) {
//   try {
//     const body = await request.json();
//     const { name, description, price, duration, active } = body;

//     // Отримати serviceId з асинхронного params
//     const { serviceId } = await params.params;

//     if (!name || !description || price == null || !duration) {
//       return new NextResponse("All fields are required", { status: 400 });
//     }

//     const parsedPrice = parseFloat(price);
//     const parsedDuration = parseInt(duration);

//     if (isNaN(parsedPrice)) {
//       return new NextResponse("Invalid price format", { status: 400 });
//     }

//     if (isNaN(parsedDuration)) {
//       return new NextResponse("Invalid duration format", { status: 400 });
//     }

//     const service = await prisma.service.update({
//       where: { serviceId },
//       data: {
//         name,
//         description,
//         price: parsedPrice,
//         duration: parsedDuration,
//         active,
//       },
//     });

//     return NextResponse.json(service);
//   } catch (error) {
//     console.error("Error updating service:", error);
//     return new NextResponse("Internal server error", { status: 500 });
//   }
// }
// export async function DELETE(
//   request: Request,
//   params: { params: Promise<{ serviceId: string }> }
// ) {
//   try {
//     const { serviceId } = await params.params;

//     if (!params || !params.params) {
//       return NextResponse.json("Invalid request format", { status: 400 });
//     }

//     if (!serviceId) {
//       return NextResponse.json("Service ID is required", { status: 400 });
//     }

//     const service = await prisma.service.delete({
//       where: { serviceId },
//     });

//     return NextResponse.json(service, { status: 200 });
//   } catch (error) {
//     console.error("Error deleting service:", error);
//     return NextResponse.json("Internal server error", { status: 500 });
//   }
// }

// для оновлення та видалення послуги на пробу , вище залишив закоментовані працюючі функції PATCH та DELETE, якщо вони не потрібні, то можна видалити
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    const session = await authClient.getSession({
      fetchOptions: { headers: { cookie: cookieHeader } },
    });
    const user = session.data?.user;

    if (!user?.id) {
      return NextResponse.json(
        { error: "Unauthenticated" },
        { status: 401 }
      );
    }

    if (user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { serviceId } = await params;
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
      categoryId,
    } = body;

    const existing = await getServiceById(serviceId);
    if (!existing) {
      return NextResponse.json(
        { error: "Service not found" },
        { status: 404 }
      );
    }

    const parsedRentalPrice = Number(rentalPrice);
    const parsedRentalPeriod = Number(rentalPeriod);
    const parsedDeposit = Number(deposit);
    const parsedQuantity = Number(quantity);

    if (
      !name ||
      !description ||
      Number.isNaN(parsedRentalPrice) ||
      Number.isNaN(parsedRentalPeriod) ||
      Number.isNaN(parsedDeposit) ||
      Number.isNaN(parsedQuantity) ||
      !condition
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // const parsedPrice = parseFloat(price);
    // const parsedDuration = parseInt(duration);

    // if (isNaN(parsedPrice)) {
    //   return NextResponse.json(
    //     { error: "Invalid price format" },
    //     { status: 400 }
    //   );
    // }

    // if (isNaN(parsedDuration)) {
    //   return NextResponse.json(
    //     { error: "Invalid duration format" },
    //     { status: 400 }
    //   );
    // }

    const normalizedCategoryId =
      typeof categoryId === "string" && categoryId.trim() !== ""
        ? categoryId.trim()
        : existing.categoryId ?? "";

    const normalizedAvailable =
      typeof available === "boolean"
        ? available
        : typeof available === "string"
        ? available === "true"
        : existing.available ?? true;

    await updateServiceDoc(serviceId, {
      name,
      description,
      rentalPrice: parsedRentalPrice,
      rentalPeriod: parsedRentalPeriod,
      deposit: parsedDeposit,
      quantity: parsedQuantity,
      condition,
      available: normalizedAvailable,
      categoryId: normalizedCategoryId,
    });

    const updated = await getServiceById(serviceId);

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating service:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    const session = await authClient.getSession({
      fetchOptions: { headers: { cookie: cookieHeader } },
    });
    const user = session.data?.user;

    if (!user?.id) {
      return NextResponse.json(
        { error: "Unauthenticated" },
        { status: 401 }
      );
    }

    if (user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { serviceId } = await params;

    if (!serviceId) {
      return NextResponse.json(
        { error: "Service ID is required" },
        { status: 400 }
      );
    }

    const existing = await getServiceById(serviceId);
    if (!existing) {
      return NextResponse.json(
        { error: "Service not found" },
        { status: 404 }
      );
    }

    await deleteServiceDoc(serviceId);

    return NextResponse.json(existing, { status: 200 });
  } catch (error) {
    console.error("Error deleting service:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
