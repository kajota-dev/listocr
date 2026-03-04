"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import { X, Check } from "lucide-react";

const BEFORE_ITEMS = [
  "Propiedades perdidas en chats de WhatsApp",
  "Imágenes dispersas en 5 grupos diferentes",
  "Clientes repreguntando lo mismo una y otra vez",
  "Sin seguimiento, sin historial, sin orden",
  "Presentaciones improvisadas que no convencen",
  "Tarjetas de papel que se pierden o se mojan",
];

const AFTER_ITEMS = [
  "Ficha digital profesional con tu foto y QR",
  "Todo tu catálogo centralizado en un link",
  "Comparte el QR y el cliente lo tiene todo",
  "Dashboard con seguimiento de vistas y clics",
  "Presencia profesional desde el primer contacto",
  "QR dinámico impreso, digital o en pantalla",
];

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants: Variants = {
  hidden:  { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};

export default function PainSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="como-funciona" className="bg-brand-surface px-6 py-24">
      <div className="mx-auto max-w-5xl">
        {/* Título */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-brand-dark md:text-5xl">
            Deja el caos atrás
          </h2>
          <p className="text-lg text-brand-muted">
            Así trabaja la mayoría de agentes hoy. Así trabajarás tú con Listo.cr.
          </p>
        </motion.div>

        <div ref={ref} className="grid gap-8 md:grid-cols-2">
          {/* Antes */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="rounded-3xl border border-red-100 bg-red-50/50 p-8"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <X className="h-5 w-5 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-red-700">Antes · El Caos</h3>
            </div>
            <ul className="space-y-4">
              {BEFORE_ITEMS.map((item, i) => (
                <motion.li key={i} variants={itemVariants} className="flex items-start gap-3">
                  <X className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                  <span className="text-sm text-red-700">{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Después */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="rounded-3xl border border-emerald-brand/20 bg-emerald-muted/40 p-8"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-brand">
                <Check className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-emerald-dark">Después · Listo.cr</h3>
            </div>
            <ul className="space-y-4">
              {AFTER_ITEMS.map((item, i) => (
                <motion.li key={i} variants={itemVariants} className="flex items-start gap-3">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-brand" />
                  <span className="text-sm text-emerald-dark">{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
