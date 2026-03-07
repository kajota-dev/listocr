import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import Link from "next/link";
import { Lock, CreditCard, MessageCircle, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import type { ISubscription } from "@/types";

export const metadata: Metadata = { title: "Cuenta Suspendida | Listo.cr" };

const SUPPORT_WHATSAPP = process.env.SUPPORT_WHATSAPP ?? "50688888888";

export default async function CuentaBloqueadaPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("listo-auth-token")?.value;
  if (!token) redirect("/login");

  const payload = await verifyToken(token);
  if (!payload) redirect("/login");

  await connectDB();
  const user = await User.findById(payload.userId)
    .populate("subscriptionId")
    .select("-passwordHash")
    .lean();

  if (!user) redirect("/login");

  const sub = user.subscriptionId as unknown as ISubscription | null;
  const endDate = sub?.endDate ? new Date(sub.endDate) : null;

  return (
    <div className="w-full max-w-md">
      <div className="rounded-3xl border border-brand-border bg-white p-8 text-center shadow-sm">
        {/* Icono */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
          <Lock className="h-8 w-8 text-red-500" />
        </div>

        <h1 className="text-2xl font-bold text-brand-dark">Cuenta suspendida</h1>
        <p className="mt-2 text-brand-muted">
          Tu suscripción ha vencido y el acceso al dashboard fue pausado.
        </p>

        {endDate && (
          <div className="mt-4 rounded-xl bg-red-50 px-4 py-3">
            <p className="text-sm text-red-700">
              Venció el{" "}
              <span className="font-semibold">
                {endDate.toLocaleDateString("es-CR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </p>
          </div>
        )}

        <div className="mt-6 space-y-3">
          <Link
            href="/dashboard/facturacion/comprobante"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-brand px-5 py-3 text-sm font-semibold text-white shadow-emerald transition-colors hover:bg-emerald-dark"
          >
            <CreditCard className="h-4 w-4" />
            Subir comprobante de pago
          </Link>

          <a
            href={`https://wa.me/${SUPPORT_WHATSAPP}?text=${encodeURIComponent("Hola, necesito ayuda con mi cuenta en Listo.cr")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-brand-border px-5 py-3 text-sm font-semibold text-brand-dark transition-colors hover:bg-brand-surface"
          >
            <MessageCircle className="h-4 w-4" />
            Contactar soporte
          </a>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 text-sm text-brand-muted hover:text-brand-dark transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
