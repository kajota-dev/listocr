"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { RegisterFormState } from "@/types";

interface StepLeadScoringProps {
  userType: "independiente" | "agencia";
  leadScoreData: RegisterFormState["leadScoreData"];
  onChange: (data: Partial<RegisterFormState["leadScoreData"]>) => void;
}

interface SelectFieldProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}

function SelectField({ label, value, options, onChange }: SelectFieldProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-brand-dark">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-xl border border-brand-border bg-brand-white px-4 py-3 pr-10 text-sm text-brand-dark transition-colors focus:border-emerald-brand focus:outline-none focus:ring-2 focus:ring-emerald-brand/20"
        >
          <option value="">Selecciona una opción…</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-muted" />
      </div>
    </div>
  );
}

const INDEPENDENT_QUESTIONS = [
  {
    key: "experienceYears" as const,
    label: "¿Cuántos años llevas en el sector inmobiliario?",
    options: [
      { value: "0", label: "Menos de 1 año" },
      { value: "2", label: "1 a 3 años" },
      { value: "5", label: "3 a 7 años" },
      { value: "10", label: "Más de 7 años" },
    ],
  },
  {
    key: "monthlyDeals" as const,
    label: "¿Cuántos cierres haces aproximadamente por mes?",
    options: [
      { value: "0", label: "0 a 1 cierre" },
      { value: "2", label: "2 a 3 cierres" },
      { value: "5", label: "4 a 6 cierres" },
      { value: "7", label: "7 o más cierres" },
    ],
  },
  {
    key: "currentTool" as const,
    label: "¿Qué herramienta usas hoy para gestionar tus propiedades?",
    options: [
      { value: "whatsapp", label: "WhatsApp y fotos" },
      { value: "excel", label: "Excel o Google Sheets" },
      { value: "crm", label: "Algún CRM o software" },
      { value: "ninguna", label: "Ninguna, todo de memoria" },
    ],
  },
  {
    key: "biggestChallenge" as const,
    label: "¿Cuál es tu mayor reto ahora mismo?",
    options: [
      { value: "seguimiento", label: "Hacer seguimiento a clientes" },
      { value: "presentaciones", label: "Presentar propiedades de forma profesional" },
      { value: "organizacion", label: "Organizar mi portafolio" },
      { value: "captar", label: "Captar nuevos clientes" },
    ],
  },
];

const AGENCY_QUESTIONS = [
  {
    key: "agentCount" as const,
    label: "¿Cuántos agentes tiene tu equipo actualmente?",
    options: [
      { value: "2-5",  label: "2 a 5 agentes" },
      { value: "5-20", label: "5 a 20 agentes" },
      { value: "20+",  label: "Más de 20 agentes" },
    ],
  },
  {
    key: "activeProperties" as const,
    label: "¿Cuántas propiedades gestionan en total?",
    options: [
      { value: "<10",   label: "Menos de 10" },
      { value: "10-50", label: "10 a 50" },
      { value: "50-200",label: "50 a 200" },
      { value: "200+",  label: "Más de 200" },
    ],
  },
  {
    key: "currentSystem" as const,
    label: "¿Qué sistema usan hoy para gestionar el equipo?",
    options: [
      { value: "whatsapp", label: "WhatsApp / grupos" },
      { value: "excel",    label: "Excel compartido" },
      { value: "crm",      label: "CRM propio o de terceros" },
      { value: "ninguno",  label: "Ninguno aún" },
    ],
  },
  {
    key: "growthBlocker" as const,
    label: "¿Qué frena más el crecimiento de tu agencia?",
    options: [
      { value: "desorganizacion", label: "Desorganización interna" },
      { value: "herramientas",    label: "Falta de herramientas profesionales" },
      { value: "costos",          label: "Costos de tecnología altos" },
      { value: "visibilidad",     label: "Poca visibilidad en línea" },
    ],
  },
];

export default function StepLeadScoring({ userType, leadScoreData, onChange }: StepLeadScoringProps) {
  const questions = userType === "independiente" ? INDEPENDENT_QUESTIONS : AGENCY_QUESTIONS;

  return (
    <div>
      <h2 className="mb-2 text-2xl font-bold text-brand-dark">
        Cuéntanos un poco más
      </h2>
      <p className="mb-8 text-brand-muted">
        Esto nos ayuda a personalizar Listo.cr para ti. Solo toma 30 segundos.
      </p>

      <div className="flex flex-col gap-5">
        {questions.map(({ key, label, options }) => (
          <SelectField
            key={key}
            label={label}
            value={String(leadScoreData[key as keyof typeof leadScoreData] ?? "")}
            options={options}
            onChange={(v) => onChange({ [key]: v })}
          />
        ))}
      </div>
    </div>
  );
}
