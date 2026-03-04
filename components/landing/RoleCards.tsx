"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { User, Building2, Check } from "lucide-react";

const ROLES = [
  {
    id: "independiente",
    icon: User,
    title: "Agente Independiente",
    subtitle: "Tu marca personal, tu catálogo, tu ritmo",
    description:
      "Crea tu identidad digital profesional, gestiona tu portafolio de propiedades y conecta directamente con clientes via WhatsApp. Sin intermediarios.",
    features: [
      "Ficha digital con foto y QR",
      "Catálogo propio de propiedades",
      "Link directo a WhatsApp",
      "Perfil indexable en Google",
    ],
    cta: "Soy Agente Independiente",
    href: "/registro?tipo=independiente",
    highlight: false,
  },
  {
    id: "agencia",
    icon: Building2,
    title: "Empresa / Agencia",
    subtitle: "Gestiona tu equipo como un líder",
    description:
      "Panel central para toda tu agencia. Asigna propiedades, monitorea el rendimiento de cada agente y escala tu operación con datos reales.",
    features: [
      "Panel multi-agente centralizado",
      "Gestión de comisiones",
      "Ficha de agencia + fichas individuales",
      "Reportes de rendimiento del equipo",
    ],
    cta: "Lidero una Agencia",
    href: "/registro?tipo=agencia",
    highlight: true,
  },
];

export default function RoleCards() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="bg-brand-white px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-brand-dark md:text-5xl">
            ¿Cómo trabajas tú?
          </h2>
          <p className="text-lg text-brand-muted">
            Listo.cr se adapta a tu manera de operar.
          </p>
        </motion.div>

        <div ref={ref} className="grid gap-6 md:grid-cols-2">
          {ROLES.map(({ id, icon: Icon, title, subtitle, description, features, cta, href, highlight }, i) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 32 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.15 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className={`relative overflow-hidden rounded-3xl border p-8 transition-shadow hover:shadow-xl ${
                highlight
                  ? "border-emerald-brand bg-emerald-muted/30"
                  : "border-brand-border bg-brand-surface"
              }`}
            >
              {highlight && (
                <div className="absolute right-4 top-4 rounded-full bg-emerald-brand px-3 py-1 text-xs font-semibold text-white">
                  Más popular
                </div>
              )}

              <div className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${
                highlight ? "bg-emerald-brand" : "bg-brand-border"
              }`}>
                <Icon className={`h-7 w-7 ${highlight ? "text-white" : "text-brand-dark"}`} />
              </div>

              <h3 className="mb-1 text-2xl font-bold text-brand-dark">{title}</h3>
              <p className={`mb-4 text-sm font-medium ${highlight ? "text-emerald-dark" : "text-brand-muted"}`}>
                {subtitle}
              </p>
              <p className="mb-6 text-base text-brand-muted leading-relaxed">{description}</p>

              <ul className="mb-8 space-y-3">
                {features.map((f, fi) => (
                  <li key={fi} className="flex items-center gap-3">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-brand/20">
                      <Check className="h-3 w-3 text-emerald-brand" />
                    </div>
                    <span className="text-sm text-brand-dark">{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={href}
                className={`flex w-full items-center justify-center rounded-2xl px-6 py-3.5 font-semibold transition-all ${
                  highlight
                    ? "bg-emerald-brand text-white hover:bg-emerald-dark shadow-emerald hover:shadow-emerald-strong"
                    : "border border-brand-border bg-brand-white text-brand-dark hover:border-emerald-brand hover:text-emerald-brand"
                }`}
              >
                {cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
