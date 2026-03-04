import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { Subscription } from "@/lib/models/Subscription";
import AgenteView from "@/components/dashboard/AgenteView";
import type { SubscriptionPlan, IUser, IPublicProfile } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Mi Dashboard" };

export default async function AgenteDashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("listo-auth-token")?.value;
  if (!token) redirect("/registro");

  const payload = await verifyToken(token);
  if (!payload) redirect("/registro");

  await connectDB();
  const user = await User.findById(payload.userId)
    .populate("subscriptionId")
    .select("-passwordHash")
    .lean();

  if (!user) redirect("/registro");

  if (user.role === "lider_agencia") redirect("/dashboard/empresa");
  if (user.role === "super_admin") redirect("/dashboard/admin");

  const plan = ((user.subscriptionId as { plan?: SubscriptionPlan } | null)?.plan ?? "free") as string;

  return (
    <AgenteView
      user={user as unknown as IUser & { publicProfile: IPublicProfile }}
      planName={plan}
    />
  );
}
