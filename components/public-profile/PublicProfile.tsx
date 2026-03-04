import ProfileHeader from "./ProfileHeader";
import WhatsAppButton from "./WhatsAppButton";
import PropertyCard from "./PropertyCard";
import type { IUser, IProperty, IPublicProfile, UserRole } from "@/types";

interface PublicProfileProps {
  user: {
    _id: string;
    name: string;
    role: UserRole;
    fichaDigitalSlug: string;
    publicProfile: IPublicProfile;
    plan: string;
    maxProperties: number;
    totalProperties: number;
  };
  properties: IProperty[];
  isPreview?: boolean;
}

export default function PublicProfile({ user, properties, isPreview = false }: PublicProfileProps) {
  const { publicProfile, fichaDigitalSlug, role, plan, maxProperties } = user;
  const isFree = plan === "free";
  const hasMore = isFree && (maxProperties === 5) && properties.length >= 5;

  return (
    <div className={`min-h-screen bg-brand-surface ${isPreview ? "rounded-2xl overflow-hidden border border-brand-border" : ""}`}>
      <div className="mx-auto max-w-md">
        {/* Header: cover + avatar + nombre + bio + redes */}
        <div className="bg-brand-white">
          <ProfileHeader
            publicProfile={publicProfile}
            role={role}
            fichaSlug={fichaDigitalSlug}
          />

          {/* Botón WhatsApp */}
          <div className="px-5 pb-6">
            <WhatsAppButton
              slug={fichaDigitalSlug}
              whatsappNumber={publicProfile.whatsappNumber}
              message={publicProfile.whatsappMessage}
            />
          </div>
        </div>

        {/* Propiedades */}
        {properties.length > 0 && (
          <div className="mt-4 px-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-brand-dark">Propiedades</h2>
              {publicProfile.showPropertyCount && (
                <span className="rounded-full bg-brand-surface px-3 py-1 text-sm text-brand-muted">
                  {properties.length} disponibles
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {properties.map((prop) => (
                <PropertyCard
                  key={String(prop._id)}
                  property={prop}
                  ownerSlug={fichaDigitalSlug}
                  whatsappNumber={publicProfile.whatsappNumber}
                  whatsappMessage={publicProfile.whatsappMessage}
                />
              ))}
            </div>

            {/* Aviso plan free */}
            {hasMore && (
              <div className="mt-4 rounded-2xl border border-emerald-brand/20 bg-emerald-muted p-4 text-center">
                <p className="text-sm text-emerald-dark">
                  Este agente tiene más propiedades disponibles.
                </p>
                <p className="mt-1 text-xs text-emerald-dark/70">
                  Contáctalo directamente para verlas todas.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Footer: solo en plan free */}
        {isFree && !isPreview && (
          <div className="mt-8 pb-8 text-center">
            <a
              href="https://listo.cr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-brand-muted hover:text-emerald-brand transition-colors"
            >
              Hecho con ❤️ en{" "}
              <span className="font-semibold text-emerald-brand">Listo.cr</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
