import Link from "next/link";
import type { Metadata } from "next";
import RegisterForm from "@/components/register/RegisterForm";

export const metadata: Metadata = {
  title: "Crear cuenta",
  description: "Regístrate en Listo.cr y obtén tu ficha digital profesional gratis.",
};

export default function RegistroPage() {
  return (
    <div className="min-h-screen bg-brand-surface px-4 py-12">
      {/* Header */}
      <div className="mb-8 flex items-center justify-center">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-brand">
            <span className="text-sm font-bold text-white">L</span>
          </div>
          <span className="text-xl font-bold text-brand-dark">Listo.cr</span>
        </Link>
      </div>

      <RegisterForm />

      {/* Login link */}
      <p className="mt-6 text-center text-sm text-brand-muted">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="font-medium text-emerald-brand hover:text-emerald-dark">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}
