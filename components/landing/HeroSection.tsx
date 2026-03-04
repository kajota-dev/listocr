"use client";

import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

export default function HeroSection() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-brand-white px-6 pt-20">
      {/* Fondo con glow */}
      <div className="absolute inset-0 bg-emerald-glow pointer-events-none" />

      {/* Círculo decorativo */}
      <div className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-brand/5 blur-3xl pointer-events-none" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center gap-6"
      >
        {/* Badge pill */}
        <motion.div variants={itemVariants}>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-brand/20 bg-emerald-muted px-4 py-2 text-sm font-medium text-emerald-dark">
            <span className="h-2 w-2 rounded-full bg-emerald-brand animate-glow-pulse" />
            Para agentes inmobiliarios de Costa Rica
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl font-bold tracking-tight text-brand-dark md:text-7xl leading-[1.05]"
        >
          Vende más,{" "}
          <span className="text-gradient-emerald">gestiona menos.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={itemVariants}
          className="max-w-2xl text-xl text-brand-muted leading-relaxed md:text-2xl"
        >
          Tu ficha digital profesional con QR. Comparte tus propiedades al instante,
          impresiona a tus clientes y cierra más negocios desde el primer contacto.
        </motion.p>

        {/* CTAs */}
        <motion.div variants={itemVariants} className="flex flex-col items-center gap-4 sm:flex-row">
          <Link
            href="/registro"
            className="group flex items-center gap-2 rounded-2xl bg-emerald-brand px-8 py-4 text-lg font-semibold text-white shadow-emerald transition-all hover:bg-emerald-dark hover:shadow-emerald-strong"
          >
            Obtén tu Ficha Digital Gratis
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
          <a
            href="#como-funciona"
            className="px-8 py-4 text-lg font-medium text-brand-muted transition-colors hover:text-brand-dark"
          >
            Ver cómo funciona →
          </a>
        </motion.div>

        {/* Social proof */}
        <motion.div variants={itemVariants} className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <p className="text-sm text-brand-muted">
            Sin tarjeta de crédito · Listo en 2 minutos · Cancela cuando quieras
          </p>
        </motion.div>

        {/* Mockup de perfil */}
        <motion.div
          variants={itemVariants}
          className="mt-8 w-full max-w-sm"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="overflow-hidden rounded-3xl border border-brand-border bg-white shadow-xl"
          >
            {/* Header del mockup */}
            <div className="h-24 bg-gradient-to-r from-emerald-brand to-emerald-light" />
            <div className="px-5 pb-5 pt-0">
              <div className="-mt-8 flex items-end gap-3">
                <div className="h-16 w-16 rounded-full border-3 border-white bg-emerald-muted shadow-md" />
              </div>
              <div className="mt-2">
                <div className="h-5 w-40 rounded-full bg-brand-dark" />
                <div className="mt-1 h-3 w-28 rounded-full bg-emerald-brand/30" />
                <div className="mt-3 h-10 w-full rounded-xl bg-emerald-brand" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
