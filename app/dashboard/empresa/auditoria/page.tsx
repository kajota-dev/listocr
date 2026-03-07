import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { ActivityLog } from "@/lib/models/ActivityLog";
import AuditTrail from "@/components/dashboard/agency/AuditTrail";
import type { Metadata } from "next";
import type { IActivityLog } from "@/types";

export const metadata: Metadata = { title: "Auditoría de Agencia | Listo.cr" };

export default async function AgenciaAuditoriaPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("listo-auth-token")?.value;
  if (!token) redirect("/login");

  const payload = await verifyToken(token);
  if (!payload || payload.role !== "lider_agencia") redirect("/dashboard");

  await connectDB();
  const user = await User.findById(payload.userId).select("agencyId").lean();
  if (!user?.agencyId) redirect("/dashboard/empresa");

  const logs = await ActivityLog.find({ agencyId: user.agencyId })
    .sort({ createdAt: -1 })
    .limit(50)
    .populate("userId", "name publicProfile.avatarUrl")
    .lean();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-dark">Auditoría de Agencia</h1>
        <p className="text-brand-muted">Historial de actividad de todos los agentes de tu agencia.</p>
      </div>
      <AuditTrail logs={logs as unknown as IActivityLog[]} />
    </div>
  );
}
