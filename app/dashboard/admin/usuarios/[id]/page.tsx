import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { Property } from "@/lib/models/Property";
import { ActivityLog } from "@/lib/models/ActivityLog";
import UserDeepMetrics from "@/components/dashboard/admin/UserDeepMetrics";
import type { Metadata } from "next";
import type { IUser, IActivityLog, ISubscription } from "@/types";

export const metadata: Metadata = { title: "Detalle de Usuario | Listo.cr Admin" };

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("listo-auth-token")?.value;
  if (!token) redirect("/login");

  const payload = await verifyToken(token);
  if (!payload || payload.role !== "super_admin") redirect("/dashboard/admin");

  const { id } = await params;

  await connectDB();
  const user = await User.findById(id)
    .populate("subscriptionId")
    .select("-passwordHash")
    .lean();

  if (!user) redirect("/dashboard/admin/usuarios");

  const [propertyCount, recentLogs] = await Promise.all([
    Property.countDocuments({ ownerId: id }),
    ActivityLog.find({ userId: id }).sort({ createdAt: -1 }).limit(20).lean(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-dark">Detalle de Usuario</h1>
        <p className="text-brand-muted">{user.name} · {user.email}</p>
      </div>
      <UserDeepMetrics
        user={user as unknown as IUser & { subscriptionId?: ISubscription | null }}
        propertyCount={propertyCount}
        recentLogs={recentLogs as unknown as IActivityLog[]}
      />
    </div>
  );
}
