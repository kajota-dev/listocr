import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Property } from "@/lib/models/Property";
import { User } from "@/lib/models/User";
import { ActivityLog } from "@/lib/models/ActivityLog";
import PropertyReport from "@/components/dashboard/property/PropertyReport";
import type { Metadata } from "next";
import type { IProperty, IActivityLog } from "@/types";

export const metadata: Metadata = { title: "Reporte de Propiedad | Listo.cr" };

export default async function PropertyReportePage({
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

  const agent = await User.findById(property.ownerId)
    .select("-passwordHash")
    .lean();

  const logs = await ActivityLog.find({ entityId: id })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  const agentViews = agent?.publicProfile?.totalViews ?? 0;
  const agentClicks = agent?.publicProfile?.totalClicks ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-dark">Reporte de Propiedad</h1>
        <p className="text-brand-muted">Métricas, estado legal y brochure PDF</p>
      </div>
      <PropertyReport
        property={property as unknown as IProperty}
        agentViews={agentViews}
        agentClicks={agentClicks}
        logs={logs as unknown as IActivityLog[]}
      />
    </div>
  );
}
