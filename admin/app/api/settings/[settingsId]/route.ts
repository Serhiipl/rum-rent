import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { authClient } from "@/auth-client";
import {
  deleteSettingsDoc,
  getSettingsById,
  updateSettingsDoc,
} from "@/lib/mongo-operations";
import { settingsFormSchema } from "@/lib/zod";

type AccessResult = { response?: NextResponse };

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
  return {};
}

interface RouteParams {
  params: Promise<{ settingsId: string }>;
}

async function getSettingsId(params: RouteParams["params"]) {
  const { settingsId } = await params;
  if (!settingsId) {
    return null;
  }
  return settingsId;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const settingsId = await getSettingsId(params);
  if (!settingsId) {
    return new NextResponse("Invalid settings id", { status: 400 });
  }

  try {
    const settings = await getSettingsById(settingsId);
    if (!settings) {
      return new NextResponse("Settings not found", { status: 404 });
    }
    return NextResponse.json(settings, { status: 200 });
  } catch (error) {
    console.error("Error fetching settings by id:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const access = await requireAdminAccess();
  if (access.response) {
    return access.response;
  }

  const settingsId = await getSettingsId(params);
  if (!settingsId) {
    return new NextResponse("Invalid settings id", { status: 400 });
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

    const updated = await updateSettingsDoc(settingsId, parsed.data);
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: RouteParams
) {
  const access = await requireAdminAccess();
  if (access.response) {
    return access.response;
  }

  const settingsId = await getSettingsId(params);
  if (!settingsId) {
    return new NextResponse("Invalid settings id", { status: 400 });
  }

  try {
    await deleteSettingsDoc(settingsId);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting settings:", error);
    return NextResponse.json(
      { error: "Failed to delete settings" },
      { status: 500 }
    );
  }
}
