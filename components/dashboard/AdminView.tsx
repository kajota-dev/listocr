import { Users, Building2, CreditCard, Activity } from "lucide-react";
import MetricCard from "./shared/MetricCard";

interface AdminViewProps {
  totalUsers: number;
  totalAgencies: number;
  activeSubscriptions: { free: number; pro: number; business: number };
}

export default function AdminView({ totalUsers, totalAgencies, activeSubscriptions }: AdminViewProps) {
  const mrr = (activeSubscriptions.pro * 19) + (activeSubscriptions.business * 49);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-brand-dark">Panel Super Admin</h1>
        <p className="text-brand-muted">Métricas globales de la plataforma Listo.cr.</p>
      </div>

      {/* Métricas globales */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard
          title="Total usuarios"
          value={totalUsers}
          icon={<Users className="h-5 w-5" />}
          delta="Registrados"
          deltaPositive
        />
        <MetricCard
          title="Agencias activas"
          value={totalAgencies}
          icon={<Building2 className="h-5 w-5" />}
        />
        <MetricCard
          title="MRR estimado"
          value={`$${mrr}`}
          icon={<CreditCard className="h-5 w-5" />}
          suffix="USD/mes"
          delta="Pro + Business"
          deltaPositive
        />
        <MetricCard
          title="Suscripciones activas"
          value={activeSubscriptions.pro + activeSubscriptions.business}
          icon={<Activity className="h-5 w-5" />}
          suffix="de pago"
        />
      </div>

      {/* Distribución por plan */}
      <div className="rounded-2xl border border-brand-border bg-brand-white p-6">
        <h2 className="mb-6 text-lg font-bold text-brand-dark">Distribución por Plan</h2>
        <div className="space-y-4">
          {[
            { label: "Free", count: activeSubscriptions.free, color: "bg-brand-border" },
            { label: "Pro",  count: activeSubscriptions.pro,  color: "bg-emerald-brand" },
            { label: "Business", count: activeSubscriptions.business, color: "bg-emerald-dark" },
          ].map(({ label, count, color }) => {
            const total = Object.values(activeSubscriptions).reduce((a, b) => a + b, 0);
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            return (
              <div key={label}>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-sm font-medium text-brand-dark">{label}</span>
                  <span className="text-sm text-brand-muted">{count} usuarios ({pct}%)</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-brand-surface">
                  <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
