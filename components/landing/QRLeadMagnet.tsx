"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Smartphone, RefreshCw, Share2 } from "lucide-react";

const BENEFITS = [
  {
    icon: Smartphone,
    title: "Reemplaza las tarjetas de papel",
    desc: "Un QR imprimible o digital que nunca caduca.",
  },
  {
    icon: Share2,
    title: "Compartible por WhatsApp",
    desc: "Manda el link, el cliente escanea y ve todo.",
  },
  {
    icon: RefreshCw,
    title: "Actualizable en tiempo real",
    desc: "Cambia tus propiedades. El QR sigue igual.",
  },
];

export default function QRLeadMagnet() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="overflow-hidden bg-brand-dark px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="grid items-center gap-16 md:grid-cols-2">
          {/* Texto */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-brand/30 bg-emerald-brand/10 px-4 py-2 text-sm font-medium text-emerald-light">
              <span className="h-2 w-2 rounded-full bg-emerald-brand animate-glow-pulse" />
              El Lead Magnet
            </div>
            <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl leading-tight">
              Tu Ficha Digital.{" "}
              <span className="text-gradient-emerald">Un QR.</span>{" "}
              Infinitas puertas.
            </h2>
            <p className="mb-8 text-lg text-white/60 leading-relaxed">
              El QR apunta a tu perfil profesional en línea. Ponlo en tu tarjeta de presentación,
              en tus anuncios o en una pantalla. Si actualizas tu perfil, el QR sigue funcionando.
            </p>

            <ul className="space-y-5">
              {BENEFITS.map(({ icon: Icon, title, desc }, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-brand/20">
                    <Icon className="h-5 w-5 text-emerald-light" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{title}</p>
                    <p className="text-sm text-white/50">{desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Mockup del QR */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="flex justify-center"
          >
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="relative"
            >
              {/* Smartphone mock */}
              <div className="relative h-[520px] w-[260px] overflow-hidden rounded-[40px] border-4 border-white/10 bg-white shadow-2xl">
                {/* Notch */}
                <div className="mx-auto mt-3 h-5 w-24 rounded-full bg-brand-surface" />

                {/* Contenido del teléfono */}
                <div className="mt-2">
                  {/* Cover verde */}
                  <div className="h-28 bg-gradient-to-r from-emerald-brand to-emerald-light" />

                  {/* Perfil */}
                  <div className="px-4 pb-4">
                    <div className="-mt-8">
                      <div className="h-16 w-16 rounded-full border-4 border-white bg-emerald-muted shadow" />
                    </div>
                    <p className="mt-2 font-semibold text-brand-dark text-sm">María José Arias</p>
                    <p className="text-xs text-emerald-brand">Agente Independiente</p>
                    <p className="mt-1 text-xs text-brand-muted">Especialista en propiedades residenciales en San José y Heredia.</p>

                    {/* QR */}
                    <div className="mt-4 flex justify-center">
                      <div className="rounded-2xl border border-brand-border p-3 animate-glow-pulse">
                        <QRCodeSVG
                          value="https://listo.cr/u/maria-jose-arias"
                          size={110}
                          fgColor="#10b981"
                          bgColor="#ffffff"
                          level="M"
                        />
                      </div>
                    </div>

                    {/* Botón WhatsApp */}
                    <div className="mt-4 h-10 w-full rounded-xl bg-emerald-brand" />
                  </div>
                </div>
              </div>

              {/* Glow detrás del teléfono */}
              <div className="absolute -bottom-8 left-1/2 h-32 w-48 -translate-x-1/2 rounded-full bg-emerald-brand/20 blur-2xl" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
