import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { Property } from "@/lib/models/Property";
import EmpresaView from "@/components/dashboard/EmpresaView";
import type { IUser, IPublicProfile } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Panel de Agencia" };

export default async function EmpresaDashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("listo-auth-token")?.value;
  if (!token) redirect("/registro");

  const payload = await verifyToken(token);
  if (!payload) redirect("/registro");

  await connectDB();
  const user = await User.findById(payload.userId)
    .select("-passwordHash")
    .lean();

  if (!user) redirect("/registro");
  if (user.role === "agente_independiente") redirect("/dashboard/agente");
  if (user.role === "super_admin") redirect("/dashboard/admin");

  // Contar agentes en la agencia
  const agentCount = user.agencyId
    ? await User.countDocuments({ agencyId: user.agencyId, isActive: true })
    : 1;

  // Contar propiedades del owner
  // @ts-expect-error: Mongoose v8 ObjectId vs string type mismatch (works at runtime)
  const totalProperties = await Property.countDocuments({ ownerId: user._id });

  return (
    <EmpresaView
      user={user as unknown as IUser & { publicProfile: IPublicProfile }}
      agentCount={agentCount}
      totalProperties={totalProperties}
    />
  );
}
