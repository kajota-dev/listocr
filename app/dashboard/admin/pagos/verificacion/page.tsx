import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { PaymentReceipt } from "@/lib/models/PaymentReceipt";
import PaymentReview from "@/components/dashboard/admin/PaymentReview";
import type { Metadata } from "next";
import type { IPaymentReceipt } from "@/types";

export const metadata: Metadata = { title: "Verificación de Pagos | Listo.cr Admin" };

export default async function PagosVerificacionPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("listo-auth-token")?.value;
  if (!token) redirect("/login");

  const payload = await verifyToken(token);
  if (!payload || payload.role !== "super_admin") redirect("/dashboard/admin");

  await connectDB();
  const receipts = await PaymentReceipt.find({ status: "pending" })
    .populate("userId", "name email")
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-dark">Verificación de Pagos</h1>
        <p className="text-brand-muted">
          Revisa y aprueba los comprobantes enviados por los usuarios.
          {receipts.length > 0 && (
            <span className="ml-2 inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
              {receipts.length} pendiente{receipts.length !== 1 ? "s" : ""}
            </span>
          )}
        </p>
      </div>
      <PaymentReview receipts={receipts as unknown as IPaymentReceipt[]} />
    </div>
  );
}
