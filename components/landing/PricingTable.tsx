"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { Check, X } from "lucide-react";

const TIERS = [
  {
    id: "free",
    name: "Gratis",
    priceMonthly: 0,
    priceAnnual: 0,
    highlight: false,
    ctaLabel: "Empezar gratis",
    ctaHref: "/registro",
    badge: null,
    features: [
      "Ficha digital con QR",
      "Hasta 5 propiedades",
      "Link público compartible",
      "Perfil indexable en Google",
      "Soporte por email",
    ],
    features_excluded: [
      "Analytics y estadísticas",
      "Integración WhatsApp directa",
      "Branding personalizado",
      "Soporte prioritario",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    priceMonthly: 19,
    priceAnnual: 15,
    highlight: true,
    ctaLabel: "Empezar 14 días gratis",
    ctaHref: "/registro?plan=pro",
    badge: "Más popular",
    features: [
      "Todo lo del plan Gratis",
      "Hasta 50 propiedades",
      "Analytics detallados",
      "Integración WhatsApp",
      "QR personalizados por propiedad",
      "Sin \"Powered by Listo.cr\"",
    ],
    features_excluded: [
      "Agentes ilimitados",
      "Branding de agencia",
      "Soporte prioritario",
    ],
  },
  {
    id: "business",
    name: "Business",
    priceMonthly: 49,
    priceAnnual: 39,
    highlight: false,
    ctaLabel: "Hablar con ventas",
    ctaHref: "/registro?plan=business",
    badge: null,
    features: [
      "Todo lo del plan Pro",
      "Propiedades ilimitadas",
      "Agentes ilimitados",
      "Panel de agencia centralizado",
      "Branding personalizado",
      "Soporte prioritario 24/7",
      "Acceso a API",
    ],
    features_excluded: [],
  },
];

export default function PricingTable() {
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="precios" className="bg-brand-surface px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-brand-dark md:text-5xl">
            Precios simples y justos
          </h2>
          <p className="mb-8 text-lg text-brand-muted">
            Empieza gratis. Crece cuando estés listo.
          </p>

          {/* Toggle billing */}
          <div className="inline-flex items-center rounded-full border border-brand-border bg-brand-white p-1">
            <button
              onClick={() => setBilling("monthly")}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                billing === "monthly" ? "bg-brand-dark text-white" : "text-brand-muted hover:text-brand-dark"
              }`}
            >
              Mensual
            </button>
            <button
              onClick={() => setBilling("annual")}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                billing === "annual" ? "bg-brand-dark text-white" : "text-brand-muted hover:text-brand-dark"
              }`}
            >
              Anual
              <span className="ml-2 rounded-full bg-emerald-brand px-2 py-0.5 text-xs text-white">-20%</span>
            </button>
          </div>
        </motion.div>

        <div ref={ref} className="grid gap-6 md:grid-cols-3">
          {TIERS.map(({ id, name, priceMonthly, priceAnnual, highlight, ctaLabel, ctaHref, badge, features, features_excluded }, i) => {
            const price = billing === "annual" ? priceAnnual : priceMonthly;

            return (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 32 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                className={`relative flex flex-col rounded-3xl p-8 ${
                  highlight
                    ? "border-2 border-emerald-brand bg-brand-white shadow-emerald"
                    : "border border-brand-border bg-brand-white"
                }`}
              >
                {badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-emerald-brand px-4 py-1 text-xs font-bold text-white">
                    {badge}
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="mb-4 text-xl font-bold text-brand-dark">{name}</h3>
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-bold text-brand-dark">${price}</span>
                    <span className="mb-1 text-brand-muted">/mes</span>
                  </div>
                  {billing === "annual" && price > 0 && (
                    <p className="mt-1 text-xs text-emerald-brand">Cobrado anualmente</p>
                  )}
                </div>

                <Link
                  href={ctaHref}
                  className={`mb-8 flex w-full items-center justify-center rounded-2xl px-5 py-3.5 font-semibold transition-all ${
                    highlight
                      ? "bg-emerald-brand text-white hover:bg-emerald-dark shadow-emerald"
                      : "border border-brand-border bg-brand-surface text-brand-dark hover:border-emerald-brand hover:bg-emerald-muted"
                  }`}
                >
                  {ctaLabel}
                </Link>

                <ul className="flex-1 space-y-3">
                  {features.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-brand/20">
                        <Check className="h-2.5 w-2.5 text-emerald-brand" />
                      </div>
                      <span className="text-sm text-brand-dark">{f}</span>
                    </li>
                  ))}
                  {features_excluded.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-3 opacity-40">
                      <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-border">
                        <X className="h-2.5 w-2.5 text-brand-muted" />
                      </div>
                      <span className="text-sm text-brand-muted line-through">{f}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center text-sm text-brand-muted"
        >
          Todos los planes incluyen SSL, hosting y soporte técnico.
          Sin contratos de permanencia. Cancela cuando quieras.
        </motion.p>
      </div>
    </section>
  );
}
