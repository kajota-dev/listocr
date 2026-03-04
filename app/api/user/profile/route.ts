import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { getAuthUser } from "@/lib/auth";

// Campos del publicProfile que el usuario puede actualizar
const ALLOWED_FIELDS = [
  "displayName", "bio", "avatarUrl", "coverImageUrl",
  "whatsappNumber", "whatsappMessage", "email", "phone",
  "socialLinks", "metaTitle", "metaDescription",
  "showPropertyCount", "accentColor",
];

export async function GET() {
  try {
    const auth = await getAuthUser();
    if (!auth) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(auth.userId).select("-passwordHash");
    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    console.error("Error al obtener perfil:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = await getAuthUser();
    if (!auth) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();

    // Construir objeto de actualización solo con campos permitidos
    const update: Record<string, unknown> = {};
    for (const field of ALLOWED_FIELDS) {
      if (field in body) {
        if (field === "socialLinks" && typeof body[field] === "object") {
          // Actualizar campos específicos de socialLinks
          const socialFields = ["instagram", "facebook", "linkedin", "tiktok", "website"];
          for (const social of socialFields) {
            if (social in body[field]) {
              update[`publicProfile.socialLinks.${social}`] = body[field][social];
            }
          }
        } else {
          update[`publicProfile.${field}`] = body[field];
        }
      }
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: "No hay campos válidos para actualizar" }, { status: 400 });
    }

    const user = await User.findByIdAndUpdate(
      auth.userId,
      { $set: update },
      { new: true, runValidators: true }
    ).select("-passwordHash");

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: user.publicProfile });
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
