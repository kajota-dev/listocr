import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { PaymentReceipt } from "@/lib/models/PaymentReceipt";
import { User } from "@/lib/models/User";
import { Subscription } from "@/lib/models/Subscription";
import { getAuthUser } from "@/lib/auth";

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
    const { action } = await req.json();

    if (action !== "approve" && action !== "reject") {
      return NextResponse.json({ error: "Acción inválida" }, { status: 400 });
    }

    const receipt = await PaymentReceipt.findById(id);
    if (!receipt) {
      return NextResponse.json({ error: "Comprobante no encontrado" }, { status: 404 });
    }

    receipt.status = action === "approve" ? "approved" : "rejected";
    receipt.reviewedBy = auth.userId;
    receipt.reviewedAt = new Date();
    await receipt.save();

    // Si se aprueba: reactivar suscripción
    if (action === "approve" && receipt.subscriptionId) {
      const now = new Date();
      const endDate = new Date(now);
      endDate.setMonth(endDate.getMonth() + 1);

      await Subscription.findByIdAndUpdate(receipt.subscriptionId, {
        status: "active",
        startDate: now,
        endDate,
      });

      // Re-autorizar al usuario
      await User.findByIdAndUpdate(receipt.userId, {
        isAuthorized: true,
        approvalStatus: "approved",
      });
    }

    return NextResponse.json({ receipt });
  } catch (error) {
    console.error("Error al procesar comprobante:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
