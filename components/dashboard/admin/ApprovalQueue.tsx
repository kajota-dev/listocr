"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, ExternalLink, User, Building2, Clock } from "lucide-react";
import type { IUser } from "@/types";

interface ApprovalQueueProps {
  users: IUser[];
}

function timeAgo(date: Date): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `hace ${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `hace ${hrs}h`;
  return `hace ${Math.floor(hrs / 24)}d`;
}

export default function ApprovalQueue({ users: initialUsers }: ApprovalQueueProps) {
  const [users, setUsers] = useState(initialUsers);
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  async function handleAction(userId: string, action: "approve" | "reject") {
    setLoading((prev) => ({ ...prev, [userId]: true }));
    try {
      const res = await fetch(`/api/admin/authorize/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u._id !== userId));
      }
    } finally {
      setLoading((prev) => ({ ...prev, [userId]: false }));
    }
  }

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-brand-border bg-white py-16 text-center">
        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-muted">
          <Check className="h-7 w-7 text-emerald-brand" />
        </div>
        <p className="font-semibold text-brand-dark">Sin solicitudes pendientes</p>
        <p className="mt-1 text-sm text-brand-muted">Todas las solicitudes han sido revisadas.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {users.map((user) => (
          <motion.div
            key={user._id}
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -32, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden rounded-2xl border border-brand-border bg-white p-5"
          >
            <div className="flex items-start gap-4">
              {/* Avatar inicial */}
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-muted text-lg font-bold text-emerald-dark">
                {user.name.charAt(0).toUpperCase()}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-brand-dark">{user.name}</p>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    user.role === "lider_agencia"
                      ? "bg-blue-50 text-blue-700"
                      : "bg-emerald-muted text-emerald-dark"
                  }`}>
                    {user.role === "lider_agencia" ? (
                      <><Building2 className="h-3 w-3" />Agencia</>
                    ) : (
                      <><User className="h-3 w-3" />Independiente</>
                    )}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-brand-muted">
                    <Clock className="h-3 w-3" />
                    {timeAgo(user.createdAt)}
                  </span>
                </div>

                <p className="mt-0.5 text-sm text-brand-muted">{user.email}</p>

                {/* Redes sociales para verificar */}
                {user.publicProfile?.socialLinks && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {Object.entries(user.publicProfile.socialLinks)
                      .filter(([, v]) => v)
                      .map(([key, url]) => (
                        <a
                          key={key}
                          href={url as string}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-lg bg-brand-surface px-2.5 py-1 text-xs font-medium text-brand-muted hover:text-emerald-brand transition-colors"
                        >
                          <ExternalLink className="h-3 w-3" />
                          {key}
                        </a>
                      ))}
                  </div>
                )}
              </div>

              {/* Acciones */}
              <div className="flex shrink-0 gap-2">
                <button
                  onClick={() => handleAction(user._id, "reject")}
                  disabled={loading[user._id]}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-200 text-red-500 transition-colors hover:bg-red-50 disabled:opacity-50"
                  title="Rechazar"
                >
                  <X className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleAction(user._id, "approve")}
                  disabled={loading[user._id]}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-brand text-white transition-colors hover:bg-emerald-dark disabled:opacity-50"
                  title="Aprobar"
                >
                  {loading[user._id] ? (
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
