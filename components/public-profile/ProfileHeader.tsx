import Image from "next/image";
import { User } from "lucide-react";
import SocialLinks from "./SocialLinks";
import type { IPublicProfile, UserRole } from "@/types";

const ROLE_LABELS: Record<UserRole, string> = {
  agente_independiente: "Agente Independiente",
  lider_agencia:        "Líder de Agencia",
  agente_empresa:       "Agente Inmobiliario",
  super_admin:          "Administrador",
};

interface ProfileHeaderProps {
  publicProfile: IPublicProfile;
  role: UserRole;
  fichaSlug: string;
}

export default function ProfileHeader({ publicProfile, role, fichaSlug }: ProfileHeaderProps) {
  return (
    <div>
      {/* Cover Image / Banner */}
      <div className="relative h-44 w-full overflow-hidden bg-gradient-to-br from-emerald-brand to-emerald-dark">
        {publicProfile.coverImageUrl ? (
          <Image
            src={publicProfile.coverImageUrl}
            alt="Portada"
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-emerald-glow-strong" />
        )}
      </div>

      {/* Avatar + Info */}
      <div className="px-5 pb-5">
        {/* Avatar */}
        <div className="-mt-12 mb-4">
          <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-white bg-brand-surface shadow-lg">
            {publicProfile.avatarUrl ? (
              <Image
                src={publicProfile.avatarUrl}
                alt={publicProfile.displayName}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-emerald-muted">
                <User className="h-10 w-10 text-emerald-brand" />
              </div>
            )}
          </div>
        </div>

        {/* Nombre y rol */}
        <div className="mb-3">
          <h1 className="text-2xl font-bold text-brand-dark">
            {publicProfile.displayName || "Agente Listo.cr"}
          </h1>
          <p className="text-sm font-medium text-emerald-brand">
            {ROLE_LABELS[role]}
          </p>
        </div>

        {/* Bio */}
        {publicProfile.bio && (
          <p className="mb-4 text-base leading-relaxed text-brand-muted">
            {publicProfile.bio}
          </p>
        )}

        {/* Redes sociales */}
        <SocialLinks links={publicProfile.socialLinks ?? {}} />

        {/* Badge verificado */}
        <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-muted px-3 py-1 text-xs font-medium text-emerald-dark">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-brand" />
          Perfil verificado · listo.cr/u/{fichaSlug}
        </div>
      </div>
    </div>
  );
}
