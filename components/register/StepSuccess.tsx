"use client";

import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { Copy, ArrowRight, Check } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

interface StepSuccessProps {
  userName: string;
  fichaSlug: string;
  userType: "independiente" | "agencia";
}

export default function StepSuccess({ userName, fichaSlug, userType }: StepSuccessProps) {
  const [copied, setCopied] = useState(false);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://listo.cr";
  const fichaUrl = `${appUrl}/u/${fichaSlug}`;
  const dashboardPath = userType === "agencia" ? "/dashboard/empresa" : "/dashboard/agente";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(fichaUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="flex flex-col items-center text-center">
      {/* Checkmark animado */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
        className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-brand shadow-emerald"
      >
        <motion.svg
          className="h-10 w-10 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <motion.path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </motion.svg>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="mb-2 text-2xl font-bold text-brand-dark">
          ¡Tu Identidad Digital está viva!
        </h2>
        <p className="mb-8 text-brand-muted">
          {userName.split(" ")[0]}, ya tienes tu perfil profesional en línea.
        </p>
      </motion.div>

      {/* Preview de tarjeta con QR */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="mb-6 w-full max-w-xs overflow-hidden rounded-2xl border border-brand-border bg-brand-white shadow-card"
      >
        {/* Mini header verde */}
        <div className="h-16 bg-gradient-to-r from-emerald-brand to-emerald-light" />
        <div className="px-5 pb-5 pt-0">
          <div className="-mt-7 mb-3 h-14 w-14 rounded-full border-4 border-white bg-emerald-muted shadow" />
          <p className="mb-0.5 text-left text-sm font-bold text-brand-dark">{userName}</p>
          <p className="mb-4 text-left text-xs text-emerald-brand">
            {userType === "agencia" ? "Líder de Agencia" : "Agente Independiente"}
          </p>

          <div className="flex justify-center">
            <div className="rounded-xl border border-brand-border p-2 animate-glow-pulse">
              <QRCodeSVG
                value={fichaUrl}
                size={100}
                fgColor="#10b981"
                bgColor="#ffffff"
                level="M"
              />
            </div>
          </div>

          <p className="mt-3 text-center text-xs text-brand-muted">{fichaUrl}</p>
        </div>
      </motion.div>

      {/* Nota sobre el QR */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mb-8 text-sm text-brand-muted"
      >
        Este QR siempre apuntará a tu perfil.{" "}
        <span className="text-brand-dark">Complétalo en el Dashboard</span>{" "}
        y tus clientes verán la información actualizada al instante.
      </motion.p>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex w-full flex-col gap-3"
      >
        <Link
          href={dashboardPath}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-brand px-6 py-4 font-semibold text-white shadow-emerald transition-all hover:bg-emerald-dark"
        >
          Completar mi Perfil
          <ArrowRight className="h-5 w-5" />
        </Link>

        <button
          onClick={handleCopy}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-brand-border bg-brand-white px-6 py-3.5 font-semibold text-brand-dark transition-all hover:border-emerald-brand hover:text-emerald-brand"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-emerald-brand" />
              ¡Link copiado!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copiar link de mi Ficha
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
}
