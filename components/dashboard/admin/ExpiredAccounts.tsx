"use client";

import { useState } from "react";
import { AlertTriangle, Lock, Mail, Clock } from "lucide-react";
import type { IUser, ISubscription } from "@/types";

type ExpiredUser = Omit<IUser, "subscriptionId"> & {
  subscriptionId: ISubscription | null;
};

interface ExpiredAccountsProps {
  users: ExpiredUser[];
}

function daysSince(date: Date): number {
  return Math.floor((Date.now() - new Date(date).getTime()) / 86400000);
}

export default function ExpiredAccounts({ users: initialUsers }: ExpiredAccountsProps) {
  const [users, setUsers] = useState(initialUsers);
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  async function handleBlock(userId: string) {
    setLoading((p) => ({ ...p, [userId]: true }));
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAuthorized: false }),
      });
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u._id !== userId));
      }
    } finally {
      setLoading((p) => ({ ...p, [userId]: false }));
    }
  }

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-brand-border bg-white py-16 text-center">
        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-muted">
          <Clock className="h-7 w-7 text-emerald-brand" />
        </div>
        <p className="font-semibold text-brand-dark">Sin suscripciones vencidas</p>
        <p className="mt-1 text-sm text-brand-muted">Todos los usuarios tienen su plan vigente.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-brand-border bg-white">
      <table className="w-full text-sm">
        <thead className="border-b border-brand-border bg-brand-surface">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-brand-muted">Usuario</th>
            <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-brand-muted sm:table-cell">Plan</th>
            <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-brand-muted md:table-cell">Venció</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-brand-muted">Días vencido</th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-brand-muted">Acción</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-brand-border">
          {users.map((user) => {
            const sub = user.subscriptionId;
            const endDate = sub?.endDate ? new Date(sub.endDate) : null;
            const daysOver = endDate ? daysSince(endDate) : 0;

            return (
              <tr key={user._id} className="transition-colors hover:bg-brand-surface">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-50 text-xs font-bold text-red-600">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-brand-dark">{user.name}</p>
                      <p className="flex items-center gap-1 text-xs text-brand-muted">
                        <Mail className="h-3 w-3" />{user.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="hidden px-4 py-4 sm:table-cell">
                  <span className="rounded-full bg-brand-surface px-2.5 py-1 text-xs font-medium capitalize text-brand-dark">
                    {sub?.plan ?? "—"}
                  </span>
                </td>
                <td className="hidden px-4 py-4 text-brand-muted md:table-cell">
                  {endDate ? endDate.toLocaleDateString("es-CR") : "—"}
                </td>
                <td className="px-4 py-4">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                    daysOver > 30
                      ? "bg-red-100 text-red-700"
                      : daysOver > 7
                      ? "bg-amber-100 text-amber-700"
                      : "bg-orange-50 text-orange-600"
                  }`}>
                    <AlertTriangle className="h-3 w-3" />
                    {daysOver}d
                  </span>
                </td>
                <td className="px-4 py-4 text-right">
                  <button
                    onClick={() => handleBlock(user._id)}
                    disabled={loading[user._id]}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                  >
                    <Lock className="h-3 w-3" />
                    {loading[user._id] ? "..." : "Bloquear"}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
