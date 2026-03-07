import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Property } from "@/lib/models/Property";
import { ActivityLog } from "@/lib/models/ActivityLog";
import ActivityLogView from "@/components/dashboard/property/ActivityLogView";
import type { Metadata } from "next";
import type { IActivityLog } from "@/types";

export const metadata: Metadata = { title: "Bitácora de Propiedad | Listo.cr" };

export default async function PropertyBitacoraPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("listo-auth-token")?.value;
  if (!token) redirect("/login");

  const payload = await verifyToken(token);
  if (!payload) redirect("/login");

  const { id } = await params;

  await connectDB();
  const property = await Property.findById(id).lean();
  if (!property) redirect("/dashboard/agente/propiedades");

  const logs = await ActivityLog.find({ entityId: id })
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-dark">Bitácora</h1>
        <p className="text-brand-muted">Historial de cambios de {property.title as string}</p>
      </div>
      <ActivityLogView logs={logs as unknown as IActivityLog[]} />
    </div>
  );
}
