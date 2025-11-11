import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { authClient } from "@/auth-client";
import { insertSettings, getSettings } from "@/lib/mongo-operations";
import { settingsFormSchema } from "@/lib/zod";
import { randomUUID } from "crypto";

type AccessResult = { response?: NextResponse; userId?: string };

async function requireAdminAccess(): Promise<AccessResult> {
  const cookieStore = await cookies();
  const session = await authClient.getSession({
    fetchOptions: {
      headers: {
        cookie: cookieStore.toString(),
      },
    },
  });

  const user = session.data?.user;
  if (!user?.id) {
    return { response: new NextResponse("Unauthenticated", { status: 401 }) };
  }
  if (user.role !== "admin") {
    return { response: new NextResponse("Forbidden", { status: 403 }) };
  }

  return { userId: user.id };
}

export async function GET() {
  try {
    const settings = await getSettings();
    return NextResponse.json(settings, { status: 200 });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const access = await requireAdminAccess();
  if (access.response) {
    return access.response;
  }

  try {
    const payload = await request.json();
    const parsed = settingsFormSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid settings payload", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const settings = await insertSettings({
      settingsId: randomUUID(),
      ...parsed.data,
    });

    return NextResponse.json(settings, { status: 201 });
  } catch (error) {
    console.error("Error creating settings:", error);
    return NextResponse.json(
      { error: "Failed to create settings" },
      { status: 500 }
    );
  }
}
