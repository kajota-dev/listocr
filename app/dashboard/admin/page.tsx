import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { Agency } from "@/lib/models/Agency";
import { Subscription } from "@/lib/models/Subscription";
import AdminView from "@/components/dashboard/AdminView";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Super Admin" };

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("listo-auth-token")?.value;
  if (!token) redirect("/registro");

  const payload = await verifyToken(token);
  if (!payload || payload.role !== "super_admin") redirect("/dashboard/agente");

  await connectDB();

  const [totalUsers, totalAgencies, freeSubs, proSubs, businessSubs] = await Promise.all([
    User.countDocuments({ isActive: true }),
    Agency.countDocuments({ isActive: true }),
    Subscription.countDocuments({ plan: "free", status: "active" }),
    Subscription.countDocuments({ plan: "pro",  status: "active" }),
    Subscription.countDocuments({ plan: "business", status: "active" }),
  ]);

  return (
    <AdminView
      totalUsers={totalUsers}
      totalAgencies={totalAgencies}
      activeSubscriptions={{ free: freeSubs, pro: proSubs, business: businessSubs }}
    />
  );
}
