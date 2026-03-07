import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";
import ManualMembership from "@/components/dashboard/admin/ManualMembership";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Registro de Membresía | Listo.cr Admin" };

export default async function MembresiasRegistroPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("listo-auth-token")?.value;
  if (!token) redirect("/login");

  const payload = await verifyToken(token);
  if (!payload || payload.role !== "super_admin") redirect("/dashboard/admin");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-dark">Registro Manual de Membresía</h1>
        <p className="text-brand-muted">Asigna o renueva el plan de un usuario sin procesar pago en línea.</p>
      </div>
      <ManualMembership />
    </div>
  );
}
