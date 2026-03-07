"use client";

import { motion } from "framer-motion";
import { Clock, CheckCircle, XCircle, ArrowLeft, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function AwaitingContent() {
  const params = useSearchParams();
  const status = params.get("status") ?? "pending";
  const isRejected = status === "rejected";

  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-surface px-4">
      <div className="w-full max-w-md rounded-3xl border border-brand-border bg-white p-8 shadow-card text-center">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-brand">
              <span className="text-sm font-bold text-white">L</span>
            </div>
            <span className="text-lg font-bold text-brand-dark">Listo.cr</span>
          </Link>
        </div>

        {/* Icono animado */}
        {isRejected ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="mb-6 flex justify-center"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
              <XCircle className="h-10 w-10 text-red-500" />
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="mb-6 flex justify-center"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-muted">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Clock className="h-10 w-10 text-emerald-brand" />
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Título */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {isRejected ? (
            <>
              <h1 className="mb-2 text-2xl font-bold text-brand-dark">
                Solicitud no aprobada
              </h1>
              <p className="mb-6 text-brand-muted">
                Tu solicitud de acceso no fue aprobada. Puedes contactarnos para
                obtener más información o resolver cualquier inconveniente.
              </p>
            </>
          ) : (
            <>
              <h1 className="mb-2 text-2xl font-bold text-brand-dark">
                Tu solicitud está en revisión
              </h1>
              <p className="mb-6 text-brand-muted">
                Estamos verificando que tu negocio cumpla con nuestros estándares.
                Recibirás un correo en{" "}
                <span className="font-semibold text-brand-dark">24–48 horas</span>{" "}
                con acceso a tu cuenta.
              </p>
            </>
          )}

          {/* Badge de estado */}
          <div className={`mb-8 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
            isRejected
              ? "bg-red-50 text-red-600"
              : "bg-emerald-muted text-emerald-dark"
          }`}>
            {isRejected ? (
              <><XCircle className="h-4 w-4" /> Solicitud rechazada</>
            ) : (
              <><CheckCircle className="h-4 w-4" /> Solicitud recibida ✓</>
            )}
          </div>
        </motion.div>

        {/* Pasos de qué esperar (solo si pendiente) */}
        {!isRejected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-8 space-y-3 text-left"
          >
            {[
              "Revisamos tu información de registro",
              "Verificamos que seas un agente o agencia real",
              "Activamos tu cuenta y te enviamos el correo",
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-muted text-xs font-bold text-emerald-dark">
                  {i + 1}
                </div>
                <p className="text-sm text-brand-muted">{step}</p>
              </div>
            ))}
          </motion.div>
        )}

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col gap-3"
        >
          {isRejected && (
            <a
              href="https://wa.me/50600000000?text=Hola%2C%20mi%20solicitud%20de%20Listo.cr%20fue%20rechazada%20y%20quisiera%20m%C3%A1s%20informaci%C3%B3n."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-brand px-6 py-3.5 font-semibold text-white shadow-emerald hover:bg-emerald-dark transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              Contactar soporte
            </a>
          )}
          <Link
            href="/"
            className="flex items-center justify-center gap-2 rounded-2xl border border-brand-border px-6 py-3.5 text-sm font-semibold text-brand-muted hover:border-brand-dark hover:text-brand-dark transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Link>
        </motion.div>
      </div>
    </main>
  );
}

export default function AwaitingApprovalPage() {
  return (
    <Suspense fallback={null}>
      <AwaitingContent />
    </Suspense>
  );
}
