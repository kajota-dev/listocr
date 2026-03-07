import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";
import ReceiptUpload from "@/components/dashboard/billing/ReceiptUpload";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Enviar Comprobante | Listo.cr" };

export default async function ComprobanteFacturacionPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("listo-auth-token")?.value;
  if (!token) redirect("/login");

  const payload = await verifyToken(token);
  if (!payload) redirect("/login");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-dark">Enviar Comprobante de Pago</h1>
        <p className="text-brand-muted">
          Sube tu comprobante de transferencia y activa o renueva tu plan.
        </p>
      </div>
      <ReceiptUpload />
    </div>
  );
}
