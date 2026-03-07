import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { Subscription } from "@/lib/models/Subscription";
import { PaymentReceipt } from "@/lib/models/PaymentReceipt";
import { PLAN_FEATURES } from "@/lib/models/Subscription";
import { getAuthUser } from "@/lib/auth";
import type { SubscriptionPlan } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthUser();
    if (!auth || auth.role !== "super_admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    await connectDB();
    const { userId, plan, months, amountPaid, currency, notes } = await req.json();

    if (!userId || !plan || !months) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
    }

    const user = await User.findById(userId).lean();
    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    const now = new Date();
    const endDate = new Date(now);
    endDate.setMonth(endDate.getMonth() + months);

    const features = PLAN_FEATURES[plan as SubscriptionPlan];

    let subscription;
    if (user.subscriptionId) {
      subscription = await Subscription.findByIdAndUpdate(
        user.subscriptionId,
        {
          plan: plan as SubscriptionPlan,
          status: "active",
          priceUSD: amountPaid ?? 0,
          billingCycle: "monthly",
          startDate: now,
          endDate,
          features,
        },
        { new: true }
      );
    } else {
      subscription = await Subscription.create({
        userId,
        plan: plan as SubscriptionPlan,
        status: "active",
        priceUSD: amountPaid ?? 0,
        billingCycle: "monthly",
        startDate: now,
        endDate,
        features,
      });
    }

    // Actualizar usuario
    await User.findByIdAndUpdate(userId, {
      subscriptionId: subscription!._id,
      isAuthorized: true,
      approvalStatus: "approved",
    });

    // Registrar pago manual
    const receipt = await PaymentReceipt.create({
      userId,
      // @ts-expect-error: Mongoose v8 ObjectId vs string type mismatch (works at runtime)
      subscriptionId: subscription!._id,
      imageUrl: "manual",
      amount: amountPaid ?? 0,
      currency: currency ?? "USD",
      notes: notes ?? "Registro manual por administrador",
      status: "approved",
      reviewedBy: auth.userId,
      reviewedAt: now,
    });

    return NextResponse.json({ subscription, receipt }, { status: 201 });
  } catch (error) {
    console.error("Error al registrar membresía:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
