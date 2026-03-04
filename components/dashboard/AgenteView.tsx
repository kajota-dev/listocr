import Link from "next/link";
import { Eye, MousePointerClick, Home, QrCode, Plus, ExternalLink } from "lucide-react";
import MetricCard from "./shared/MetricCard";
import ProfileEditor from "./ProfileEditor";
import type { IUser, IPublicProfile } from "@/types";

interface AgenteViewProps {
  user: IUser & { publicProfile: IPublicProfile };
  planName: string;
}

export default function AgenteView({ user, planName }: AgenteViewProps) {
  const { publicProfile, fichaDigitalSlug, properties } = user;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://listo.cr";

  return (
    <div className="space-y-8">
      {/* Encabezado */}
      <div>
        <h1 className="text-2xl font-bold text-brand-dark">
          Hola, {user.name.split(" ")[0]} 👋
        </h1>
        <p className="text-brand-muted">Aquí tienes un resumen de tu actividad.</p>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard
          title="Vistas de tu perfil"
          value={publicProfile.totalViews}
          icon={<Eye className="h-5 w-5" />}
          delta="Esta semana"
          deltaPositive
        />
        <MetricCard
          title="Clics en WhatsApp"
          value={publicProfile.totalClicks}
          icon={<MousePointerClick className="h-5 w-5" />}
        />
        <MetricCard
          title="Propiedades activas"
          value={Array.isArray(properties) ? properties.length : 0}
          icon={<Home className="h-5 w-5" />}
          suffix="publicadas"
        />
        <MetricCard
          title="Límite del plan"
          value={planName === "free" ? "5" : planName === "pro" ? "50" : "∞"}
          icon={<QrCode className="h-5 w-5" />}
          suffix="propiedades"
        />
      </div>

      {/* Acceso rápido */}
      <div className="grid gap-4 sm:grid-cols-3">
        <a
          href={`${appUrl}/u/${fichaDigitalSlug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-2xl border border-emerald-brand/20 bg-emerald-muted/30 p-4 transition-colors hover:bg-emerald-muted/60"
        >
          <ExternalLink className="h-5 w-5 text-emerald-brand" />
          <div>
            <p className="text-sm font-semibold text-emerald-dark">Ver mi Ficha</p>
            <p className="text-xs text-emerald-dark/60">Como la ven tus clientes</p>
          </div>
        </a>
        <Link
          href="/dashboard/agente/propiedades/nueva"
          className="flex items-center gap-3 rounded-2xl border border-brand-border bg-brand-white p-4 transition-colors hover:border-emerald-brand"
        >
          <Plus className="h-5 w-5 text-brand-muted" />
          <div>
            <p className="text-sm font-semibold text-brand-dark">Agregar propiedad</p>
            <p className="text-xs text-brand-muted">Suma al catálogo</p>
          </div>
        </Link>
        <div className="flex items-center gap-3 rounded-2xl border border-brand-border bg-brand-white p-4">
          <QrCode className="h-5 w-5 text-brand-muted" />
          <div>
            <p className="text-sm font-semibold text-brand-dark">Tu slug</p>
            <p className="text-xs font-mono text-emerald-brand">/u/{fichaDigitalSlug}</p>
          </div>
        </div>
      </div>

      {/* Editor de perfil */}
      <ProfileEditor initialProfile={publicProfile} fichaSlug={fichaDigitalSlug} />
    </div>
  );
}
