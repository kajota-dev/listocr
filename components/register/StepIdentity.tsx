"use client";

import { motion } from "framer-motion";
import { User, Building2 } from "lucide-react";

interface StepIdentityProps {
  selected: "independiente" | "agencia" | null;
  onSelect: (type: "independiente" | "agencia") => void;
}

const OPTIONS = [
  {
    id: "independiente" as const,
    icon: User,
    title: "Soy Agente Independiente",
    desc: "Manejo mis propiedades y clientes por mi cuenta. Quiero mi marca personal.",
  },
  {
    id: "agencia" as const,
    icon: Building2,
    title: "Lidero una Agencia",
    desc: "Tengo un equipo de agentes y necesito gestionar todo desde un panel central.",
  },
];

export default function StepIdentity({ selected, onSelect }: StepIdentityProps) {
  return (
    <div>
      <h2 className="mb-2 text-2xl font-bold text-brand-dark">¿Cómo trabajas?</h2>
      <p className="mb-8 text-brand-muted">
        Selecciona tu perfil para personalizar tu experiencia.
      </p>

      <div className="flex flex-col gap-4">
        {OPTIONS.map(({ id, icon: Icon, title, desc }) => (
          <motion.button
            key={id}
            type="button"
            onClick={() => onSelect(id)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={`flex items-start gap-4 rounded-2xl border-2 p-5 text-left transition-all ${
              selected === id
                ? "border-emerald-brand bg-emerald-muted/40 shadow-emerald"
                : "border-brand-border bg-brand-white hover:border-emerald-brand/40"
            }`}
          >
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
              selected === id ? "bg-emerald-brand" : "bg-brand-surface"
            }`}>
              <Icon className={`h-6 w-6 ${selected === id ? "text-white" : "text-brand-muted"}`} />
            </div>
            <div>
              <p className="font-semibold text-brand-dark">{title}</p>
              <p className="mt-1 text-sm text-brand-muted">{desc}</p>
            </div>
            {selected === id && (
              <div className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-brand">
                <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
