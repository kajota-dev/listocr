import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Sidebar from "@/components/dashboard/shared/Sidebar";
import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { PaymentReceipt } from "@/lib/models/PaymentReceipt";
import type { SubscriptionPlan } from "@/types";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("listo-auth-token")?.value;

  if (!token) {
    redirect("/login");
  }

  const payload = await verifyToken(token);
  if (!payload) {
    redirect("/login");
  }

  await connectDB();
  const user = await User.findById(payload.userId)
    .populate("subscriptionId")
    .select("-passwordHash")
    .lean();

  if (!user || !user.isActive) {
    redirect("/login");
  }

  // Verificar aprobación (super_admin siempre pasa)
  if (!user.isAuthorized && user.role !== "super_admin") {
    redirect("/registro/espera");
  }

  // Verificar suscripción activa (solo para cuentas que no sean super_admin)
  if (user.role !== "super_admin") {
    const sub = user.subscriptionId as { status?: string; endDate?: Date } | null;
    const isExpired =
      sub &&
      sub.status !== "active" &&
      sub.endDate &&
      new Date(sub.endDate) < new Date();
    if (isExpired) {
      redirect("/dashboard/cuenta/bloqueada");
    }
  }

  const plan = ((user.subscriptionId as { plan?: SubscriptionPlan } | null)?.plan ?? "free") as string;

  // Para super_admin: contar solicitudes pendientes de aprobación + comprobantes
  let pendingCount = 0;
  if (user.role === "super_admin") {
    const [pendingUsers, pendingReceipts] = await Promise.all([
      User.countDocuments({ approvalStatus: "pending" }),
      PaymentReceipt.countDocuments({ status: "pending" }),
    ]);
    pendingCount = pendingUsers + pendingReceipts;
  }

  return (
    <div className="flex min-h-screen flex-col bg-brand-surface lg:flex-row">
      <Sidebar
        role={user.role}
        userName={user.name}
        fichaSlug={user.fichaDigitalSlug}
        planName={plan}
        pendingCount={pendingCount}
      />
      <main className="flex-1 p-4 lg:p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
