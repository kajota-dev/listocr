"use client";

import { useState } from "react";
import {
  User, Mail, Phone, Shield, Calendar, Home, CreditCard,
  CheckCircle, XCircle, AlertTriangle, Clock,
} from "lucide-react";
import type { IUser, IActivityLog, ISubscription } from "@/types";

interface UserDeepMetricsProps {
  user: IUser & { subscriptionId?: ISubscription | null };
  propertyCount: number;
  recentLogs: IActivityLog[];
}

const ROLE_LABELS: Record<string, string> = {
  agente_independiente: "Agente Independiente",
  lider_agencia:        "Líder de Agencia",
  agente_empresa:       "Agente Empresa",
  super_admin:          "Super Admin",
};

const ACTION_LABELS: Record<string, string> = {
  created:       "Creó",
  updated:       "Actualizó",
  deleted:       "Eliminó",
  status_changed: "Cambió estado de",
  price_changed:  "Cambió precio de",
};

function timeAgo(date: Date): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `hace ${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `hace ${hrs}h`;
  return `hace ${Math.floor(hrs / 24)}d`;
}

export default function UserDeepMetrics({
  user,
  propertyCount,
  recentLogs,
}: UserDeepMetricsProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState(user);

  async function handleAction(action: "suspend" | "unsuspend" | "authorize" | "deauthorize") {
    setLoading(action);
    try {
      const body: Record<string, unknown> = {};
      if (action === "suspend")      { body.isActive = false; body.suspendedAt = new Date(); }
      if (action === "unsuspend")    { body.isActive = true;  body.suspendedAt = null; }
      if (action === "authorize")    { body.isAuthorized = true;  body.approvalStatus = "approved"; }
      if (action === "deauthorize")  { body.isAuthorized = false; body.approvalStatus = "rejected"; }

      const res = await fetch(`/api/admin/users/${currentUser._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser((prev) => ({ ...prev, ...data.user }));
      }
    } finally {
      setLoading(null);
    }
  }

  const sub = currentUser.subscriptionId as ISubscription | null | undefined;
  const isExpired = sub && sub.endDate && new Date(sub.endDate) < new Date();

  return (
    <div className="space-y-6">
      {/* Datos del usuario */}
      <div className="rounded-2xl border border-brand-border bg-white p-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          {/* Avatar */}
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-emerald-muted text-2xl font-bold text-emerald-dark">
            {currentUser.name.charAt(0).toUpperCase()}
          </div>

          <div className="flex-1 space-y-3">
            <div>
              <h2 className="text-xl font-bold text-brand-dark">{currentUser.name}</h2>
              <p className="text-sm text-brand-muted">{ROLE_LABELS[currentUser.role] ?? currentUser.role}</p>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 text-sm">
              <span className="flex items-center gap-2 text-brand-muted">
                <Mail className="h-4 w-4" />{currentUser.email}
              </span>
              {currentUser.phone && (
                <span className="flex items-center gap-2 text-brand-muted">
                  <Phone className="h-4 w-4" />{currentUser.phone}
                </span>
              )}
              <span className="flex items-center gap-2 text-brand-muted">
                <Calendar className="h-4 w-4" />
                Registro: {new Date(currentUser.createdAt).toLocaleDateString("es-CR")}
              </span>
              <span className="flex items-center gap-2 text-brand-muted">
                <Home className="h-4 w-4" />{propertyCount} propiedades
              </span>
            </div>

            {/* Badges de estado */}
            <div className="flex flex-wrap gap-2">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                currentUser.isActive
                  ? "bg-emerald-muted text-emerald-dark"
                  : "bg-red-50 text-red-600"
              }`}>
                {currentUser.isActive ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                {currentUser.isActive ? "Activo" : "Suspendido"}
              </span>
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                currentUser.isAuthorized
                  ? "bg-blue-50 text-blue-700"
                  : "bg-amber-100 text-amber-700"
              }`}>
                <Shield className="h-3 w-3" />
                {currentUser.isAuthorized ? "Autorizado" : "Pendiente"}
              </span>
              {sub && (
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                  isExpired
                    ? "bg-red-50 text-red-600"
                    : "bg-emerald-muted text-emerald-dark"
                }`}>
                  <CreditCard className="h-3 w-3" />
                  {sub.plan} {isExpired ? "(vencido)" : `· hasta ${new Date(sub.endDate).toLocaleDateString("es-CR")}`}
                </span>
              )}
            </div>
          </div>

          {/* Acciones admin */}
          <div className="flex shrink-0 flex-wrap gap-2 sm:flex-col">
            {currentUser.isActive ? (
              <button
                onClick={() => handleAction("suspend")}
                disabled={!!loading}
                className="rounded-xl border border-red-200 px-4 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
              >
                {loading === "suspend" ? "..." : "Suspender"}
              </button>
            ) : (
              <button
                onClick={() => handleAction("unsuspend")}
                disabled={!!loading}
                className="rounded-xl border border-emerald-200 px-4 py-2 text-xs font-semibold text-emerald-dark transition-colors hover:bg-emerald-muted disabled:opacity-50"
              >
                {loading === "unsuspend" ? "..." : "Reactivar"}
              </button>
            )}
            {!currentUser.isAuthorized ? (
              <button
                onClick={() => handleAction("authorize")}
                disabled={!!loading}
                className="rounded-xl bg-emerald-brand px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-dark disabled:opacity-50"
              >
                {loading === "authorize" ? "..." : "Autorizar"}
              </button>
            ) : (
              <button
                onClick={() => handleAction("deauthorize")}
                disabled={!!loading}
                className="rounded-xl border border-amber-200 px-4 py-2 text-xs font-semibold text-amber-700 transition-colors hover:bg-amber-50 disabled:opacity-50"
              >
                {loading === "deauthorize" ? "..." : "Revocar acceso"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Actividad reciente */}
      <div className="rounded-2xl border border-brand-border bg-white p-6">
        <h3 className="mb-4 font-semibold text-brand-dark">Actividad reciente</h3>
        {recentLogs.length === 0 ? (
          <p className="text-sm text-brand-muted">Sin actividad registrada.</p>
        ) : (
          <div className="space-y-3">
            {recentLogs.map((log) => (
              <div key={log._id} className="flex items-start gap-3 text-sm">
                <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-surface">
                  <Clock className="h-3 w-3 text-brand-muted" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="font-medium text-brand-dark">
                    {ACTION_LABELS[log.action] ?? log.action}
                  </span>
                  <span className="ml-1 text-brand-muted capitalize">{log.entityType}</span>
                </div>
                <span className="shrink-0 text-xs text-brand-muted">
                  {timeAgo(log.createdAt)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Alerta suscripción vencida */}
      {isExpired && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <div>
            <p className="font-semibold text-amber-800">Suscripción vencida</p>
            <p className="text-sm text-amber-700">
              Venció el {new Date(sub!.endDate).toLocaleDateString("es-CR")}. Renueva su membresía manualmente o espera el comprobante de pago.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
