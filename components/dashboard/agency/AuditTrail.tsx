"use client";

import { useState, useMemo } from "react";
import { Clock, Home, User, Filter } from "lucide-react";
import Link from "next/link";
import type { IActivityLog } from "@/types";

type PopulatedLog = Omit<IActivityLog, "userId"> & {
  userId: { _id: string; name: string; publicProfile?: { avatarUrl?: string } } | string;
};

interface AuditTrailProps {
  logs: PopulatedLog[];
}

const ACTION_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  created:        { label: "Creó",            color: "text-emerald-dark",  bg: "bg-emerald-muted" },
  updated:        { label: "Actualizó",       color: "text-blue-700",      bg: "bg-blue-50"       },
  deleted:        { label: "Eliminó",         color: "text-red-600",       bg: "bg-red-50"        },
  status_changed: { label: "Cambió estado",   color: "text-amber-700",     bg: "bg-amber-100"     },
  price_changed:  { label: "Cambió precio",   color: "text-purple-700",    bg: "bg-purple-50"     },
};

function timeAgo(date: Date): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `hace ${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `hace ${hrs}h`;
  return `hace ${Math.floor(hrs / 24)}d`;
}

function buildDescription(log: PopulatedLog): string {
  const agentName = typeof log.userId === "object" ? log.userId.name : "Agente";
  const conf = ACTION_CONFIG[log.action];
  const verb = conf?.label ?? log.action;
  const subject = (log.metadata?.propertyTitle as string) ?? log.entityType;

  if (log.action === "price_changed" && log.changes?.length) {
    const c = log.changes[0];
    return `${agentName} cambió precio de "${subject}" de $${c.oldValue} → $${c.newValue}`;
  }
  if (log.action === "status_changed" && log.changes?.length) {
    const c = log.changes[0];
    return `${agentName} cambió estado de "${subject}" de ${c.oldValue} → ${c.newValue}`;
  }
  return `${agentName} ${verb.toLowerCase()} "${subject}"`;
}

const ACTION_OPTIONS = [
  { value: "", label: "Todas las acciones" },
  { value: "created",        label: "Creaciones" },
  { value: "updated",        label: "Actualizaciones" },
  { value: "deleted",        label: "Eliminaciones" },
  { value: "status_changed", label: "Cambios de estado" },
  { value: "price_changed",  label: "Cambios de precio" },
];

export default function AuditTrail({ logs }: AuditTrailProps) {
  const [actionFilter, setActionFilter] = useState("");

  const agentOptions = useMemo(() => {
    const seen = new Map<string, string>();
    for (const log of logs) {
      if (typeof log.userId === "object") {
        seen.set(log.userId._id, log.userId.name);
      }
    }
    return Array.from(seen.entries()).map(([id, name]) => ({ id, name }));
  }, [logs]);

  const [agentFilter, setAgentFilter] = useState("");

  const filtered = useMemo(() => {
    return logs.filter((log) => {
      if (actionFilter && log.action !== actionFilter) return false;
      if (agentFilter) {
        const uid = typeof log.userId === "object" ? log.userId._id : log.userId;
        if (uid !== agentFilter) return false;
      }
      return true;
    });
  }, [logs, actionFilter, agentFilter]);

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-brand-border bg-white py-16 text-center">
        <Clock className="mb-3 h-10 w-10 text-brand-border" />
        <p className="font-semibold text-brand-dark">Sin actividad registrada</p>
        <p className="mt-1 text-sm text-brand-muted">Los cambios de la agencia aparecerán aquí.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 rounded-xl border border-brand-border bg-white px-3 py-2">
          <Filter className="h-4 w-4 text-brand-muted" />
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="bg-transparent text-sm text-brand-dark focus:outline-none"
          >
            {ACTION_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {agentOptions.length > 0 && (
          <div className="flex items-center gap-2 rounded-xl border border-brand-border bg-white px-3 py-2">
            <User className="h-4 w-4 text-brand-muted" />
            <select
              value={agentFilter}
              onChange={(e) => setAgentFilter(e.target.value)}
              className="bg-transparent text-sm text-brand-dark focus:outline-none"
            >
              <option value="">Todos los agentes</option>
              {agentOptions.map(({ id, name }) => (
                <option key={id} value={id}>{name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="rounded-2xl border border-brand-border bg-white p-6">
        {filtered.length === 0 ? (
          <p className="text-center text-sm text-brand-muted">No hay resultados para los filtros aplicados.</p>
        ) : (
          <div className="relative space-y-0">
            {/* Línea vertical */}
            <div className="absolute left-[19px] top-0 h-full w-0.5 bg-brand-border" />

            {filtered.map((log, i) => {
              const conf = ACTION_CONFIG[log.action] ?? ACTION_CONFIG.updated;
              const description = buildDescription(log);
              const isProperty = log.entityType === "property";

              return (
                <div
                  key={log._id}
                  className={`relative flex gap-4 pb-6 ${i === filtered.length - 1 ? "pb-0" : ""}`}
                >
                  {/* Dot */}
                  <div className={`relative z-10 mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${conf.bg} ${conf.color}`}>
                    {typeof log.userId === "object" && log.userId.name
                      ? log.userId.name.charAt(0).toUpperCase()
                      : "?"}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-1.5">
                    <p className="text-sm text-brand-dark">{description}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-3">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${conf.bg} ${conf.color}`}>
                        {conf.label}
                      </span>
                      <span className="text-xs text-brand-muted">
                        {timeAgo(log.createdAt)}
                      </span>
                      {isProperty && (
                        <Link
                          href={`/dashboard/propiedades/${log.entityId}/reporte`}
                          className="flex items-center gap-1 text-xs font-medium text-emerald-brand hover:underline"
                        >
                          <Home className="h-3 w-3" />
                          Ver propiedad
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
