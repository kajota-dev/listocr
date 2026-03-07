"use client";

import { useState } from "react";
import { Download, FileText, CheckCircle, XCircle, Clock, TrendingUp } from "lucide-react";
import type { IProperty } from "@/types";
import type { IActivityLog } from "@/types";

interface PropertyReportProps {
  property: IProperty;
  agentViews: number;
  agentClicks: number;
  logs: IActivityLog[];
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  disponible: { label: "Disponible",  color: "text-emerald-dark",  bg: "bg-emerald-muted" },
  reservado:  { label: "Reservado",   color: "text-amber-700",     bg: "bg-amber-100"     },
  vendido:    { label: "Vendido",     color: "text-red-600",       bg: "bg-red-50"        },
  alquilado:  { label: "Alquilado",   color: "text-blue-700",      bg: "bg-blue-50"       },
  inactivo:   { label: "Inactivo",    color: "text-brand-muted",   bg: "bg-brand-surface" },
};

function MetricBox({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-2xl border border-brand-border bg-white p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-brand-muted">{label}</p>
      <p className="mt-1 text-2xl font-bold text-brand-dark">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-brand-muted">{sub}</p>}
    </div>
  );
}

type LegalField = "documentos" | "planoCatastro" | "estudioNotarial";
const LEGAL_FIELDS: { key: LegalField; label: string }[] = [
  { key: "documentos",      label: "Documentos al día"     },
  { key: "planoCatastro",   label: "Plano catastro"        },
  { key: "estudioNotarial", label: "Estudio notarial"      },
];

export default function PropertyReport({ property, agentViews, agentClicks, logs }: PropertyReportProps) {
  const [downloading, setDownloading] = useState(false);
  const [legal, setLegal] = useState<Record<LegalField, boolean | null>>({
    documentos: null,
    planoCatastro: null,
    estudioNotarial: null,
  });

  const daysOnMarket = Math.floor(
    (Date.now() - new Date(property.createdAt).getTime()) / 86400000
  );
  const consultCount = logs.filter((l) => l.action === "created").length;
  const statusConf = STATUS_CONFIG[property.status] ?? STATUS_CONFIG.inactivo;

  async function handleDownloadPDF() {
    setDownloading(true);
    try {
      const res = await fetch(`/api/properties/${property._id}/generate-pdf`);
      if (!res.ok) throw new Error("Error al generar PDF");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `reporte-${property.title.replace(/\s+/g, "-").toLowerCase()}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("No se pudo generar el PDF. Intenta de nuevo.");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-2xl border border-brand-border bg-white p-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-4">
          {property.images?.[0] ? (
            <img
              src={property.images[0]}
              alt={property.title}
              className="h-20 w-28 shrink-0 rounded-xl object-cover"
            />
          ) : (
            <div className="flex h-20 w-28 shrink-0 items-center justify-center rounded-xl bg-brand-surface">
              <FileText className="h-8 w-8 text-brand-border" />
            </div>
          )}
          <div>
            <h2 className="text-xl font-bold text-brand-dark">{property.title}</h2>
            <p className="mt-0.5 text-sm text-brand-muted">
              {property.province}, {property.canton}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${statusConf.bg} ${statusConf.color}`}>
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                {statusConf.label}
              </span>
              <span className="text-sm font-semibold text-brand-dark">
                {property.currency} {property.price.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={handleDownloadPDF}
          disabled={downloading}
          className="flex items-center gap-2 rounded-xl bg-emerald-brand px-5 py-2.5 text-sm font-semibold text-white shadow-emerald hover:bg-emerald-dark disabled:opacity-60 transition-colors shrink-0"
        >
          {downloading ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          Descargar Brochure PDF
        </button>
      </div>

      {/* Métricas */}
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-brand-muted">
          Rendimiento
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <MetricBox label="Vistas del perfil" value={agentViews} sub="Todas las propiedades" />
          <MetricBox label="Clics WhatsApp"    value={agentClicks} sub="Contactos directos" />
          <MetricBox label="Días en mercado"   value={daysOnMarket} sub={`Desde ${new Date(property.createdAt).toLocaleDateString("es-CR")}`} />
          <MetricBox label="Registros en log"  value={consultCount} sub="Eventos registrados" />
        </div>
      </div>

      {/* Semáforo legal */}
      <div className="rounded-2xl border border-brand-border bg-white p-6">
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-emerald-brand" />
          <h3 className="font-semibold text-brand-dark">Estado Legal</h3>
          <span className="ml-1 text-xs text-brand-muted">(actualiza manualmente)</span>
        </div>
        <div className="space-y-3">
          {LEGAL_FIELDS.map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm text-brand-dark">{label}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setLegal((p) => ({ ...p, [key]: true }))}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                    legal[key] === true
                      ? "bg-emerald-brand text-white"
                      : "border border-brand-border text-brand-muted hover:bg-brand-surface"
                  }`}
                >
                  <CheckCircle className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setLegal((p) => ({ ...p, [key]: false }))}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                    legal[key] === false
                      ? "bg-red-500 text-white"
                      : "border border-brand-border text-brand-muted hover:bg-brand-surface"
                  }`}
                >
                  <XCircle className="h-4 w-4" />
                </button>
                {legal[key] === null && (
                  <Clock className="h-5 w-5 self-center text-brand-border" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
