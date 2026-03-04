"use client";

import Image from "next/image";
import { Bed, Bath, Maximize, MapPin, Home } from "lucide-react";
import type { IProperty } from "@/types";

const OPERATION_LABELS: Record<string, string> = {
  venta:   "Venta",
  alquiler: "Alquiler",
  ambos:   "Venta / Alquiler",
};

const TYPE_LABELS: Record<string, string> = {
  casa:           "Casa",
  apartamento:    "Apartamento",
  terreno:        "Terreno",
  local_comercial:"Local Comercial",
  bodega:         "Bodega",
  oficina:        "Oficina",
};

function formatPrice(price: number, currency: "CRC" | "USD"): string {
  if (currency === "USD") {
    return new Intl.NumberFormat("es-CR", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(price);
  }
  return new Intl.NumberFormat("es-CR", { style: "currency", currency: "CRC", maximumFractionDigits: 0 }).format(price);
}

interface PropertyCardProps {
  property: IProperty;
  ownerSlug: string;
  whatsappNumber: string;
  whatsappMessage?: string;
}

export default function PropertyCard({ property, ownerSlug, whatsappNumber, whatsappMessage }: PropertyCardProps) {
  const handleConsult = () => {
    fetch(`/api/user/${ownerSlug}/click`, { method: "POST" }).catch(() => {});
    const msg = `Hola, vi tu perfil en Listo.cr. Me interesa la propiedad: "${property.title}". ¿Me puedes dar más información?`;
    const clean = whatsappNumber.replace(/\D/g, "");
    window.open(`https://wa.me/${clean}?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-brand-border bg-brand-white shadow-card transition-shadow hover:shadow-md">
      {/* Imagen */}
      <div className="relative h-44 w-full bg-brand-surface">
        {property.images?.[0] ? (
          <Image
            src={property.images[0]}
            alt={property.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Home className="h-12 w-12 text-brand-border" />
          </div>
        )}
        {/* Badges */}
        <div className="absolute left-3 top-3 flex gap-2">
          <span className="rounded-full bg-emerald-brand px-2.5 py-1 text-xs font-semibold text-white">
            {OPERATION_LABELS[property.operation]}
          </span>
          {property.featured && (
            <span className="rounded-full bg-amber-400 px-2.5 py-1 text-xs font-semibold text-white">
              Destacada
            </span>
          )}
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4">
        {/* Tipo */}
        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-brand-muted">
          {TYPE_LABELS[property.type]}
        </p>

        {/* Título */}
        <h3 className="mb-2 line-clamp-2 text-base font-semibold text-brand-dark">
          {property.title}
        </h3>

        {/* Precio */}
        <p className="mb-3 text-xl font-bold text-emerald-brand">
          {formatPrice(property.price, property.currency)}
        </p>

        {/* Ubicación */}
        <div className="mb-3 flex items-center gap-1.5 text-sm text-brand-muted">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{property.canton}, {property.province}</span>
        </div>

        {/* Specs */}
        {(property.bedrooms || property.bathrooms || property.areaM2) && (
          <div className="mb-4 flex items-center gap-4 text-sm text-brand-muted">
            {property.bedrooms != null && (
              <span className="flex items-center gap-1">
                <Bed className="h-3.5 w-3.5" />
                {property.bedrooms}
              </span>
            )}
            {property.bathrooms != null && (
              <span className="flex items-center gap-1">
                <Bath className="h-3.5 w-3.5" />
                {property.bathrooms}
              </span>
            )}
            {property.areaM2 && (
              <span className="flex items-center gap-1">
                <Maximize className="h-3.5 w-3.5" />
                {property.areaM2} m²
              </span>
            )}
          </div>
        )}

        {/* CTA */}
        <button
          onClick={handleConsult}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-brand bg-emerald-muted px-4 py-2.5 text-sm font-semibold text-emerald-dark transition-colors hover:bg-emerald-brand hover:text-white"
        >
          Consultar por esta propiedad
        </button>
      </div>
    </div>
  );
}
