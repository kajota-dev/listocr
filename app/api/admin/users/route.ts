import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { getAuthUser } from "@/lib/auth";

// GET /api/admin/users?q=... — autocomplete search for ManualMembership
export async function GET(req: NextRequest) {
  try {
    const auth = await getAuthUser();
    if (!auth || auth.role !== "super_admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") ?? "";

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
    console.error("Error en búsqueda de usuarios:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
