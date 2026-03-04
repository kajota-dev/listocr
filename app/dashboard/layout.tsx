import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Sidebar from "@/components/dashboard/shared/Sidebar";
import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { Subscription } from "@/lib/models/Subscription";
import type { SubscriptionPlan } from "@/types";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("listo-auth-token")?.value;

  if (!token) {
    redirect("/registro");
  }

  const payload = await verifyToken(token);
  if (!payload) {
    redirect("/registro");
  }

  await connectDB();
  const user = await User.findById(payload.userId)
    .populate("subscriptionId")
    .select("-passwordHash")
    .lean();

  if (!user || !user.isActive) {
    redirect("/registro");
  }

  const plan = ((user.subscriptionId as { plan?: SubscriptionPlan } | null)?.plan ?? "free") as string;

  return (
    <div className="flex min-h-screen flex-col bg-brand-surface lg:flex-row">
      <Sidebar
        role={user.role}
        userName={user.name}
        fichaSlug={user.fichaDigitalSlug}
        planName={plan}
      />
      <main className="flex-1 p-4 lg:p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
