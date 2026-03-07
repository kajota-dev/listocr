"use client";

import { useState } from "react";
import { Search, CheckCircle } from "lucide-react";

type Plan = "free" | "pro" | "business";

interface UserResult {
  _id: string;
  name: string;
  email: string;
}

const PLAN_OPTIONS: { value: Plan; label: string; price: number }[] = [
  { value: "free",     label: "Gratis",    price: 0  },
  { value: "pro",      label: "Pro",       price: 19 },
  { value: "business", label: "Business",  price: 49 },
];

export default function ManualMembership() {
  const [query, setQuery]       = useState("");
  const [results, setResults]   = useState<UserResult[]>([]);
  const [selected, setSelected] = useState<UserResult | null>(null);
  const [searching, setSearching] = useState(false);

  const [plan, setPlan]         = useState<Plan>("pro");
  const [months, setMonths]     = useState(1);
  const [amount, setAmount]     = useState(19);
  const [currency, setCurrency] = useState<"USD" | "CRC">("USD");
  const [notes, setNotes]       = useState("");

  const [saving, setSaving]   = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSearch() {
    if (!query.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(`/api/admin/users?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.users ?? []);
      }
    } finally {
      setSearching(false);
    }
  }

  async function handleSave() {
    if (!selected) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/membership", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selected._id,
          plan,
          months,
          amountPaid: amount,
          currency,
          notes,
        }),
      });
      if (res.ok) {
        setSuccess(true);
        setSelected(null);
        setQuery("");
        setResults([]);
        setTimeout(() => setSuccess(false), 4000);
      }
    } finally {
      setSaving(false);
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-brand-border bg-white py-16 text-center">
        <CheckCircle className="mb-3 h-12 w-12 text-emerald-brand" />
        <p className="font-semibold text-brand-dark">Membresía registrada</p>
        <p className="mt-1 text-sm text-brand-muted">El plan fue asignado correctamente.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Búsqueda de usuario */}
      <div className="rounded-2xl border border-brand-border bg-white p-6">
        <h3 className="mb-4 font-semibold text-brand-dark">Buscar usuario</h3>
        <div className="flex gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Email o nombre..."
            className="flex-1 rounded-xl border border-brand-border bg-brand-surface px-4 py-2.5 text-sm text-brand-dark placeholder:text-brand-muted focus:border-emerald-brand focus:outline-none"
          />
          <button
            onClick={handleSearch}
            disabled={searching}
            className="flex items-center gap-2 rounded-xl bg-emerald-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-dark disabled:opacity-60"
          >
            <Search className="h-4 w-4" />
            {searching ? "..." : "Buscar"}
          </button>
        </div>

        {results.length > 0 && !selected && (
          <div className="mt-3 space-y-1">
            {results.map((u) => (
              <button
                key={u._id}
                onClick={() => { setSelected(u); setResults([]); }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-brand-surface"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-muted text-sm font-bold text-emerald-dark">
                  {u.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-brand-dark">{u.name}</p>
                  <p className="text-xs text-brand-muted">{u.email}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {selected && (
          <div className="mt-3 flex items-center justify-between rounded-xl bg-emerald-muted px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-emerald-dark">{selected.name}</p>
              <p className="text-xs text-emerald-dark/70">{selected.email}</p>
            </div>
            <button
              onClick={() => setSelected(null)}
              className="text-xs text-emerald-dark underline"
            >
              Cambiar
            </button>
          </div>
        )}
      </div>

      {/* Formulario membresía */}
      {selected && (
        <div className="rounded-2xl border border-brand-border bg-white p-6">
          <h3 className="mb-4 font-semibold text-brand-dark">Configurar membresía</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Plan */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-muted">Plan</label>
              <select
                value={plan}
                onChange={(e) => {
                  const p = e.target.value as Plan;
                  setPlan(p);
                  setAmount(PLAN_OPTIONS.find((o) => o.value === p)?.price ?? 0);
                }}
                className="w-full rounded-xl border border-brand-border bg-brand-surface px-4 py-2.5 text-sm text-brand-dark focus:border-emerald-brand focus:outline-none"
              >
                {PLAN_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            {/* Duración */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-muted">Duración (meses)</label>
              <input
                type="number"
                min={1}
                max={24}
                value={months}
                onChange={(e) => setMonths(Number(e.target.value))}
                className="w-full rounded-xl border border-brand-border bg-brand-surface px-4 py-2.5 text-sm text-brand-dark focus:border-emerald-brand focus:outline-none"
              />
            </div>

            {/* Monto */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-muted">Monto cobrado</label>
              <input
                type="number"
                min={0}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full rounded-xl border border-brand-border bg-brand-surface px-4 py-2.5 text-sm text-brand-dark focus:border-emerald-brand focus:outline-none"
              />
            </div>

            {/* Moneda */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-muted">Moneda</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as "USD" | "CRC")}
                className="w-full rounded-xl border border-brand-border bg-brand-surface px-4 py-2.5 text-sm text-brand-dark focus:border-emerald-brand focus:outline-none"
              >
                <option value="USD">USD</option>
                <option value="CRC">CRC</option>
              </select>
            </div>

            {/* Notas */}
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-muted">Notas internas (opcional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Ej: Pago via SINPE 2024-03-01..."
                className="w-full resize-none rounded-xl border border-brand-border bg-brand-surface px-4 py-2.5 text-sm text-brand-dark placeholder:text-brand-muted focus:border-emerald-brand focus:outline-none"
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-brand py-3 text-sm font-semibold text-white shadow-emerald transition-colors hover:bg-emerald-dark disabled:opacity-60"
          >
            {saving ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <CheckCircle className="h-4 w-4" />
            )}
            {saving ? "Guardando..." : "Registrar membresía"}
          </button>
        </div>
      )}
    </div>
  );
}
