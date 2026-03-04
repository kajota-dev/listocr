import { Users, Home, DollarSign, TrendingUp } from "lucide-react";
import MetricCard from "./shared/MetricCard";
import type { IUser, IPublicProfile } from "@/types";

interface EmpresaViewProps {
  user: IUser & { publicProfile: IPublicProfile };
  agentCount: number;
  totalProperties: number;
}

export default function EmpresaView({ user, agentCount, totalProperties }: EmpresaViewProps) {
  return (
    <div className="space-y-8">
      {/* Encabezado */}
      <div>
        <h1 className="text-2xl font-bold text-brand-dark">
          Panel de Agencia
        </h1>
        <p className="text-brand-muted">
          Gestiona tu equipo y monitorea el rendimiento general.
        </p>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard
          title="Agentes activos"
          value={agentCount}
          icon={<Users className="h-5 w-5" />}
          delta="En tu equipo"
          deltaPositive
        />
        <MetricCard
          title="Propiedades totales"
          value={totalProperties}
          icon={<Home className="h-5 w-5" />}
          suffix="en catálogo"
        />
        <MetricCard
          title="Ventas este mes"
          value="--"
          icon={<DollarSign className="h-5 w-5" />}
          suffix="cierres"
        />
        <MetricCard
          title="Vistas del equipo"
          value={user.publicProfile.totalViews}
          icon={<TrendingUp className="h-5 w-5" />}
          delta="Perfil de agencia"
          deltaPositive
        />
      </div>

      {/* Tabla de agentes (placeholder) */}
      <div className="rounded-2xl border border-brand-border bg-brand-white p-6">
        <h2 className="mb-6 text-lg font-bold text-brand-dark">Mi Equipo</h2>
        <div className="space-y-4">
          {agentCount === 0 ? (
            <div className="py-12 text-center">
              <Users className="mx-auto mb-4 h-12 w-12 text-brand-border" />
              <p className="font-medium text-brand-muted">Aún no tienes agentes en tu equipo.</p>
              <p className="mt-1 text-sm text-brand-muted">Invítalos desde la sección "Mi Equipo".</p>
            </div>
          ) : (
            <p className="text-sm text-brand-muted">
              Tienes {agentCount} agente{agentCount !== 1 ? "s" : ""} en tu equipo.
            </p>
          )}
        </div>
      </div>

      {/* Gráfico de rendimiento (placeholder visual) */}
      <div className="rounded-2xl border border-brand-border bg-brand-white p-6">
        <h2 className="mb-6 text-lg font-bold text-brand-dark">Rendimiento del Equipo</h2>
        <div className="flex items-end gap-3 h-40">
          {["Ene", "Feb", "Mar", "Abr", "May", "Jun"].map((mes, i) => {
            const heights = [40, 60, 45, 75, 55, 90];
            return (
              <div key={mes} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-xl bg-emerald-brand/20 transition-all hover:bg-emerald-brand"
                  style={{ height: `${heights[i]}%` }}
                />
                <span className="text-xs text-brand-muted">{mes}</span>
              </div>
            );
          })}
        </div>
        <p className="mt-4 text-center text-xs text-brand-muted">
          Conecta tu cuenta para ver datos reales de ventas
        </p>
      </div>
    </div>
  );
}
