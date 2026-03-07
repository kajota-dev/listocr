import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import ApprovalQueue from "@/components/dashboard/admin/ApprovalQueue";
import type { Metadata } from "next";
import type { IUser } from "@/types";

export const metadata: Metadata = { title: "Aprobaciones | Listo.cr Admin" };

export default async function AprobacionesPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("listo-auth-token")?.value;
  if (!token) redirect("/login");

  const payload = await verifyToken(token);
  if (!payload || payload.role !== "super_admin") redirect("/dashboard/admin");

  await connectDB();
  const pendingUsers = await User.find({ approvalStatus: "pending" })
    .select("-passwordHash")
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-dark">Cola de Aprobaciones</h1>
        <p className="text-brand-muted">
          Revisa las redes sociales de cada solicitante antes de aprobar.
          {pendingUsers.length > 0 && (
            <span className="ml-2 inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
              {pendingUsers.length} pendiente{pendingUsers.length !== 1 ? "s" : ""}
            </span>
          )}
        </p>
      </div>

      <ApprovalQueue users={pendingUsers as unknown as IUser[]} />
    </div>
  );
}
