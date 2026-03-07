"use client";

import { useState } from "react";
import { CheckCircle, ExternalLink, Image, FileText, Send } from "lucide-react";

const STEPS = [
  { icon: Image,       label: "Toma foto de tu comprobante de pago" },
  { icon: ExternalLink, label: "Súbela a Google Photos y copia el link" },
  { icon: Send,        label: "Pégalo aquí y envía tu solicitud" },
];

export default function ReceiptUpload() {
  const [imageUrl, setImageUrl]   = useState("");
  const [amount, setAmount]       = useState("");
  const [currency, setCurrency]   = useState<"USD" | "CRC">("USD");
  const [transferRef, setTransferRef] = useState("");
  const [notes, setNotes]         = useState("");
  const [saving, setSaving]       = useState(false);
  const [success, setSuccess]     = useState(false);
  const [error, setError]         = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!imageUrl.trim() || !amount) {
      setError("La URL del comprobante y el monto son obligatorios.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/user/receipts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: imageUrl.trim(),
          amount: parseFloat(amount),
          currency,
          transferRef: transferRef.trim() || undefined,
          notes: notes.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Error al enviar el comprobante");
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setSaving(false);
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-brand-border bg-white py-16 text-center">
        <CheckCircle className="mb-3 h-12 w-12 text-emerald-brand" />
        <h3 className="text-lg font-bold text-brand-dark">¡Comprobante enviado!</h3>
        <p className="mt-2 max-w-sm text-sm text-brand-muted">
          Revisaremos tu pago en las próximas 24 horas y activaremos tu cuenta.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Instrucciones */}
      <div className="rounded-2xl border border-brand-border bg-white p-6">
        <h3 className="mb-4 font-semibold text-brand-dark">¿Cómo enviar tu comprobante?</h3>
        <div className="flex flex-col gap-4 sm:flex-row">
          {STEPS.map(({ icon: Icon, label }, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-2 rounded-2xl bg-brand-surface p-4 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-muted">
                <Icon className="h-5 w-5 text-emerald-brand" />
              </div>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-brand text-xs font-bold text-white">
                {i + 1}
              </span>
              <p className="text-sm text-brand-muted">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Formulario */}
      <div className="rounded-2xl border border-brand-border bg-white p-6">
        <h3 className="mb-4 font-semibold text-brand-dark">Datos del pago</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* URL */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-muted">
              URL del comprobante *
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://photos.google.com/..."
              className="w-full rounded-xl border border-brand-border bg-brand-surface px-4 py-2.5 text-sm text-brand-dark placeholder:text-brand-muted focus:border-emerald-brand focus:outline-none"
              required
            />
            <p className="mt-1 text-xs text-brand-muted">
              Sube la foto a Google Photos, Google Drive o similar y pega el enlace aquí.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Monto */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-muted">
                Monto pagado *
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="19.00"
                className="w-full rounded-xl border border-brand-border bg-brand-surface px-4 py-2.5 text-sm text-brand-dark placeholder:text-brand-muted focus:border-emerald-brand focus:outline-none"
                required
              />
            </div>

            {/* Moneda */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-muted">
                Moneda
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as "USD" | "CRC")}
                className="w-full rounded-xl border border-brand-border bg-brand-surface px-4 py-2.5 text-sm text-brand-dark focus:border-emerald-brand focus:outline-none"
              >
                <option value="USD">USD (dólares)</option>
                <option value="CRC">CRC (colones)</option>
              </select>
            </div>
          </div>

          {/* Referencia SINPE */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-muted">
              Referencia SINPE (opcional)
            </label>
            <div className="flex items-center gap-3 rounded-xl border border-brand-border bg-brand-surface px-4 py-2.5">
              <FileText className="h-4 w-4 shrink-0 text-brand-muted" />
              <input
                type="text"
                value={transferRef}
                onChange={(e) => setTransferRef(e.target.value)}
                placeholder="Ej: 202403011234"
                className="flex-1 bg-transparent text-sm text-brand-dark placeholder:text-brand-muted focus:outline-none"
              />
            </div>
          </div>

          {/* Notas */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-muted">
              Notas adicionales (opcional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Información adicional para el equipo de soporte..."
              className="w-full resize-none rounded-xl border border-brand-border bg-brand-surface px-4 py-2.5 text-sm text-brand-dark placeholder:text-brand-muted focus:border-emerald-brand focus:outline-none"
            />
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-brand py-3 text-sm font-semibold text-white shadow-emerald transition-colors hover:bg-emerald-dark disabled:opacity-60"
          >
            {saving ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            {saving ? "Enviando..." : "Enviar comprobante"}
          </button>
        </form>
      </div>
    </div>
  );
}
