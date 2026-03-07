import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { PaymentReceipt } from "@/lib/models/PaymentReceipt";
import { User } from "@/lib/models/User";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
  try {
    const auth = await getAuthUser();
    if (!auth) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    await connectDB();
    const receipts = await PaymentReceipt.find({ userId: auth.userId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ receipts });
  } catch (error) {
    console.error("Error al obtener comprobantes:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthUser();
    if (!auth) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    await connectDB();
    const { imageUrl, amount, currency, transferRef, notes } = await req.json();

    if (!imageUrl || !amount) {
      return NextResponse.json({ error: "URL del comprobante y monto son requeridos" }, { status: 400 });
    }

    const user = await User.findById(auth.userId).select("subscriptionId").lean();

    const receipt = await PaymentReceipt.create({
      userId: auth.userId,
      subscriptionId: user?.subscriptionId ?? undefined,
      imageUrl,
      amount,
      currency: currency ?? "USD",
      transferRef: transferRef ?? undefined,
      notes: notes ?? undefined,
      status: "pending",
    });

    return NextResponse.json({ receipt }, { status: 201 });
  } catch (error) {
    console.error("Error al crear comprobante:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
