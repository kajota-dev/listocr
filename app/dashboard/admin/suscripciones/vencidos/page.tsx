import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import ExpiredAccounts from "@/components/dashboard/admin/ExpiredAccounts";
import type { Metadata } from "next";
import type { IUser, ISubscription } from "@/types";

export const metadata: Metadata = { title: "Suscripciones Vencidas | Listo.cr Admin" };

export default async function SuscripcionesVencidasPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("listo-auth-token")?.value;
  if (!token) redirect("/login");

  const payload = await verifyToken(token);
  if (!payload || payload.role !== "super_admin") redirect("/dashboard/admin");

  await connectDB();
  const allUsers = await User.find({
    subscriptionId: { $exists: true, $ne: null },
    isAuthorized: true,
  })
    .populate("subscriptionId")
    .select("-passwordHash")
    .lean();

  const now = new Date();
  const expiredUsers = allUsers.filter((u) => {
    const sub = u.subscriptionId as unknown as ISubscription | null;
    return sub && (sub.status === "expired" || (sub.endDate && new Date(sub.endDate) < now));
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-dark">Suscripciones Vencidas</h1>
        <p className="text-brand-muted">
          Usuarios con plan expirado que aún tienen acceso activo.
          {expiredUsers.length > 0 && (
            <span className="ml-2 inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700">
              {expiredUsers.length} vencido{expiredUsers.length !== 1 ? "s" : ""}
            </span>
          )}
        </p>
      </div>
      <ExpiredAccounts
        users={expiredUsers as unknown as (IUser & { subscriptionId: ISubscription | null })[]}
      />
    </div>
  );
}
