"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, ExternalLink, User, DollarSign, FileText, Clock } from "lucide-react";
import type { IPaymentReceipt } from "@/types";

type PopulatedReceipt = Omit<IPaymentReceipt, "userId"> & {
  userId: { _id: string; name: string; email: string } | string;
};

interface PaymentReviewProps {
  receipts: PopulatedReceipt[];
}

function timeAgo(date: Date): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `hace ${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `hace ${hrs}h`;
  return `hace ${Math.floor(hrs / 24)}d`;
}

export default function PaymentReview({ receipts: initialReceipts }: PaymentReviewProps) {
  const [receipts, setReceipts] = useState(initialReceipts);
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  async function handleAction(receiptId: string, action: "approve" | "reject") {
    setLoading((p) => ({ ...p, [receiptId]: true }));
    try {
      const res = await fetch(`/api/admin/receipts/${receiptId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        setReceipts((prev) => prev.filter((r) => r._id !== receiptId));
      }
    } finally {
      setLoading((p) => ({ ...p, [receiptId]: false }));
    }
  }

  if (receipts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-brand-border bg-white py-16 text-center">
        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-muted">
          <Check className="h-7 w-7 text-emerald-brand" />
        </div>
        <p className="font-semibold text-brand-dark">Sin comprobantes pendientes</p>
        <p className="mt-1 text-sm text-brand-muted">Todos los comprobantes han sido revisados.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {receipts.map((receipt) => {
            const owner = typeof receipt.userId === "object" ? receipt.userId : null;

            return (
              <motion.div
                key={receipt._id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden rounded-2xl border border-brand-border bg-white"
              >
                {/* Imagen del comprobante */}
                <div className="relative aspect-video overflow-hidden bg-brand-surface">
                  <img
                    src={receipt.imageUrl}
                    alt="Comprobante de pago"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                  <button
                    onClick={() => setPreviewUrl(receipt.imageUrl)}
                    className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors hover:bg-black/20"
                  >
                    <ExternalLink className="h-6 w-6 text-transparent transition-colors hover:text-white" />
                  </button>
                </div>

                <div className="p-4 space-y-3">
                  {/* Usuario */}
                  {owner && (
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 shrink-0 text-brand-muted" />
                      <div className="min-w-0">
                        <p className="truncate font-medium text-brand-dark">{owner.name}</p>
                        <p className="truncate text-xs text-brand-muted">{owner.email}</p>
                      </div>
                    </div>
                  )}

                  {/* Monto */}
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 shrink-0 text-brand-muted" />
                    <span className="font-semibold text-brand-dark">
                      {receipt.currency} {receipt.amount.toLocaleString()}
                    </span>
                  </div>

                  {/* Referencia */}
                  {receipt.transferRef && (
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="h-4 w-4 shrink-0 text-brand-muted" />
                      <span className="text-brand-muted">{receipt.transferRef}</span>
                    </div>
                  )}

                  {/* Tiempo */}
                  <div className="flex items-center gap-2 text-xs text-brand-muted">
                    <Clock className="h-3 w-3" />
                    {timeAgo(receipt.createdAt)}
                  </div>

                  {/* Notas */}
                  {receipt.notes && (
                    <p className="rounded-xl bg-brand-surface p-2 text-xs text-brand-muted">
                      {receipt.notes}
                    </p>
                  )}

                  {/* Acciones */}
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => handleAction(receipt._id, "reject")}
                      disabled={loading[receipt._id]}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-red-200 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                    >
                      <X className="h-3.5 w-3.5" />Rechazar
                    </button>
                    <button
                      onClick={() => handleAction(receipt._id, "approve")}
                      disabled={loading[receipt._id]}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-brand py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-dark disabled:opacity-50"
                    >
                      {loading[receipt._id] ? (
                        <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      ) : (
                        <Check className="h-3.5 w-3.5" />
                      )}
                      Aprobar
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Preview lightbox */}
      {previewUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setPreviewUrl(null)}
        >
          <img
            src={previewUrl}
            alt="Comprobante"
            className="max-h-[90vh] max-w-full rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setPreviewUrl(null)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}
    </>
  );
}
