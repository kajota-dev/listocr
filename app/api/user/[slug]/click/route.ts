import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    await connectDB();

    await User.updateOne(
      { fichaDigitalSlug: slug, isActive: true },
      { $inc: { "publicProfile.totalClicks": 1 } }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error al registrar clic:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
