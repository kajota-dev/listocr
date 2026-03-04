import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { Property } from "@/lib/models/Property";
import { PLAN_FEATURES } from "@/lib/models/Subscription";
import type { SubscriptionPlan } from "@/types";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    await connectDB();

    const user = await User.findOne({ fichaDigitalSlug: slug, isActive: true })
      .populate("subscriptionId")
      .select("-passwordHash");

    if (!user) {
      return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 });
    }

    // Límite de propiedades según plan
    const plan = (user.subscriptionId as { plan?: SubscriptionPlan } | null)?.plan ?? "free";
    const maxProps = PLAN_FEATURES[plan as SubscriptionPlan]?.maxProperties ?? 5;
    const limit = maxProps === -1 ? 0 : maxProps; // 0 = sin límite en Mongoose

    // @ts-expect-error: Mongoose v8 ObjectId vs string type mismatch (works at runtime)
    const query = Property.find({ ownerId: user._id, status: "disponible" })
      .sort({ featured: -1, createdAt: -1 });

    if (limit > 0) query.limit(limit);

    const properties = await query.lean();

    // Incrementar vistas (fire-and-forget)
    User.updateOne(
      { _id: user._id },
      {
        $inc: { "publicProfile.totalViews": 1 },
        $set: { "publicProfile.lastViewedAt": new Date() },
      }
    ).exec();

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: String(user._id),
          name: user.name,
          role: user.role,
          fichaDigitalSlug: user.fichaDigitalSlug,
          publicProfile: user.publicProfile,
          plan,
          maxProperties: maxProps,
          totalProperties: properties.length,
        },
        properties,
      },
    });
  } catch (error) {
    console.error("Error al obtener perfil público:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
