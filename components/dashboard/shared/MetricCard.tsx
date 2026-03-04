import type { MetricCardProps } from "@/types";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function MetricCard({
  title,
  value,
  delta,
  deltaPositive = true,
  icon,
  suffix,
}: MetricCardProps) {
  return (
    <div className="rounded-2xl border border-brand-border bg-brand-white p-6 shadow-card">
      <div className="mb-4 flex items-start justify-between">
        <p className="text-sm font-medium text-brand-muted">{title}</p>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-surface text-brand-muted">
          {icon}
        </div>
      </div>
      <div className="flex items-end gap-2">
        <p className="text-3xl font-bold text-brand-dark">
          {value}
        </p>
        {suffix && (
          <p className="mb-0.5 text-sm text-brand-muted">{suffix}</p>
        )}
      </div>
      {delta && (
        <div className={`mt-2 flex items-center gap-1 text-sm font-medium ${
          deltaPositive ? "text-emerald-brand" : "text-red-500"
        }`}>
          {deltaPositive ? (
            <TrendingUp className="h-3.5 w-3.5" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5" />
          )}
          {delta}
        </div>
      )}
    </div>
  );
}
