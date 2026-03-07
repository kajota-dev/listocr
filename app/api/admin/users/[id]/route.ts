import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { getAuthUser } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getAuthUser();
    if (!auth || auth.role !== "super_admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    await connectDB();
    const { id } = await params;

    const user = await User.findById(id)
      .populate("subscriptionId")
      .select("-passwordHash")
      .lean();

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getAuthUser();
    if (!auth || auth.role !== "super_admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    await connectDB();
    const { id } = await params;
    const body = await req.json();

    const allowedFields = ["isActive", "isAuthorized", "approvalStatus", "role", "suspendedAt"];
    const update: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (field in body) update[field] = body[field];
    }

    const user = await User.findByIdAndUpdate(id, update, { new: true })
      .select("-passwordHash")
      .lean();

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function GET_SEARCH(req: NextRequest) {
  // Alias: búsqueda para autocomplete (vía query string ?q=...)
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";

  try {
    const auth = await getAuthUser();
    if (!auth || auth.role !== "super_admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    await connectDB();
    const users = await User.find({
      $or: [
        { name:  { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
      ],
    })
      .select("name email role")
      .limit(10)
      .lean();

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error en búsqueda:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
