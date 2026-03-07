"use client";

import { useState } from "react";
import { Plus, Edit3, Trash2, RefreshCw, TrendingDown, Clock } from "lucide-react";
import type { IActivityLog, ActivityAction } from "@/types";

interface ActivityLogViewProps {
  logs: (IActivityLog & { user?: { name: string; avatarUrl?: string } })[];
}

const ACTION_CONFIG: Record<ActivityAction, { icon: React.ReactNode; label: string; color: string }> = {
  created:        { icon: <Plus className="h-3.5 w-3.5" />,        label: "Creó",         color: "bg-emerald-muted text-emerald-dark" },
  updated:        { icon: <Edit3 className="h-3.5 w-3.5" />,       label: "Actualizó",    color: "bg-blue-50 text-blue-700"           },
  deleted:        { icon: <Trash2 className="h-3.5 w-3.5" />,      label: "Eliminó",      color: "bg-red-50 text-red-600"             },
  status_changed: { icon: <RefreshCw className="h-3.5 w-3.5" />,   label: "Cambió estado", color: "bg-amber-100 text-amber-700"       },
  price_changed:  { icon: <TrendingDown className="h-3.5 w-3.5" />, label: "Cambió precio", color: "bg-purple-50 text-purple-700"     },
};

function timeAgo(date: Date): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "ahora mismo";
  if (mins < 60) return `hace ${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `hace ${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `hace ${days}d`;
  return new Date(date).toLocaleDateString("es-CR");
}

function describeChange(log: IActivityLog): string {
  if (log.action === "price_changed" && log.changes?.length) {
    const c = log.changes[0];
    return `precio de ${log.metadata?.currency ?? "USD"} ${Number(c.oldValue).toLocaleString()} → ${Number(c.newValue).toLocaleString()}`;
  }
  if (log.action === "status_changed" && log.changes?.length) {
    const c = log.changes[0];
    return `estado de "${c.oldValue}" → "${c.newValue}"`;
  }
  if (log.action === "created") return "la propiedad";
  return (log.metadata?.description as string) ?? "";
}

export default function ActivityLogView({ logs }: ActivityLogViewProps) {
  const [filter, setFilter] = useState<ActivityAction | "all">("all");

  const filtered = filter === "all" ? logs : logs.filter((l) => l.action === filter);

  return (
    <div className="space-y-4">
      {/* Filtro */}
      <div className="flex flex-wrap gap-2">
        {(["all", "created", "updated", "status_changed", "price_changed"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              filter === f
                ? "bg-emerald-brand text-white"
                : "border border-brand-border text-brand-muted hover:bg-brand-surface"
            }`}
          >
            {f === "all" ? "Todos" : ACTION_CONFIG[f]?.label ?? f}
          </button>
        ))}
      </div>

      {/* Timeline */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-brand-border bg-white py-12 text-center">
          <Clock className="mb-3 h-8 w-8 text-brand-border" />
          <p className="text-sm text-brand-muted">Sin actividad registrada</p>
        </div>
      ) : (
        <div className="relative space-y-0">
          {/* Línea vertical */}
          <div className="absolute left-5 top-6 bottom-6 w-px bg-brand-border" />

          {filtered.map((log, i) => {
            const conf = ACTION_CONFIG[log.action] ?? ACTION_CONFIG.updated;
            return (
              <div key={log._id ?? i} className="relative flex gap-4 pb-4">
                {/* Ícono en línea de tiempo */}
                <div className={`relative z-10 mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${conf.color}`}>
                  {conf.icon}
                </div>

                {/* Contenido */}
                <div className="flex-1 rounded-2xl border border-brand-border bg-white p-4">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm text-brand-dark">
                      <span className="font-semibold">
                        {(log as { user?: { name: string } }).user?.name ?? "Sistema"}
                      </span>{" "}
                      {conf.label.toLowerCase()}{" "}
                      <span className="text-brand-muted">{describeChange(log)}</span>
                    </p>
                    <span className="shrink-0 text-xs text-brand-muted">{timeAgo(log.createdAt)}</span>
                  </div>
                  {log.changes && log.changes.length > 0 && log.action === "updated" && (
                    <div className="mt-2 space-y-1">
                      {log.changes.map((c, ci) => (
                        <p key={ci} className="text-xs text-brand-muted">
                          <span className="font-medium">{c.field}:</span>{" "}
                          <span className="line-through">{String(c.oldValue)}</span>
                          {" → "}
                          <span className="text-brand-dark">{String(c.newValue)}</span>
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
