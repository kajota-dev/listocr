import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { Property } from "@/lib/models/Property";
import { PLAN_FEATURES } from "@/lib/models/Subscription";
import PublicProfile from "@/components/public-profile/PublicProfile";
import type { SubscriptionPlan, IProperty } from "@/types";

// ISR: revalidar cada 60 segundos para reducir carga en MongoDB
export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  await connectDB();

  const user = await User.findOne({ fichaDigitalSlug: slug, isActive: true }).lean();
  if (!user) {
    return { title: "Perfil no encontrado | Listo.cr" };
  }

  const profile = user.publicProfile;
  const displayName = profile?.displayName || user.name;
  const bio = profile?.bio || `Propiedades y contacto de ${displayName}`;

  return {
    title: `${displayName} | Agente Inmobiliario`,
    description: bio,
    openGraph: {
      type: "profile",
      title: `${displayName} | Listo.cr`,
      description: bio,
      images: profile?.avatarUrl
        ? [{ url: profile.avatarUrl, width: 400, height: 400, alt: displayName }]
        : [],
    },
    twitter: {
      card: "summary",
      title: `${displayName} | Listo.cr`,
      description: bio,
    },
  };
}

export default async function PublicProfilePage({ params }: PageProps) {
  const { slug } = await params;
  await connectDB();

  const user = await User.findOne({ fichaDigitalSlug: slug, isActive: true })
    .populate("subscriptionId")
    .lean();

  if (!user) notFound();

  const plan = ((user.subscriptionId as { plan?: SubscriptionPlan } | null)?.plan ?? "free") as SubscriptionPlan;
  const maxProps = PLAN_FEATURES[plan]?.maxProperties ?? 5;
  const limit = maxProps === -1 ? 0 : maxProps;

  // @ts-expect-error: Mongoose v8 ObjectId vs string type mismatch (works at runtime)
  const propQuery = Property.find({ ownerId: user._id, status: "disponible" })
    .sort({ featured: -1, createdAt: -1 });

  if (limit > 0) propQuery.limit(limit);

  const properties = await propQuery.lean() as unknown as IProperty[];

  // Incrementar vistas (fire-and-forget)
  User.updateOne(
    { _id: user._id },
    {
      $inc: { "publicProfile.totalViews": 1 },
      $set: { "publicProfile.lastViewedAt": new Date() },
    }
  ).exec();

  return (
    <PublicProfile
      user={{
        _id: String(user._id),
        name: user.name,
        role: user.role,
        fichaDigitalSlug: user.fichaDigitalSlug,
        publicProfile: user.publicProfile,
        plan,
        maxProperties: maxProps,
        totalProperties: properties.length,
      }}
      properties={properties}
    />
  );
}
