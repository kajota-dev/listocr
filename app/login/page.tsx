"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, LogIn } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd]   = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Error al iniciar sesión");
        return;
      }

      // Redirigir según rol
      const role = data.data.user.role;
      if (role === "super_admin") {
        router.push("/dashboard/admin");
      } else if (role === "lider_agencia" || role === "agente_empresa") {
        router.push("/dashboard/empresa");
      } else {
        router.push("/dashboard/agente");
      }
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-surface px-4">
      <div className="w-full max-w-sm rounded-3xl border border-brand-border bg-white p-8 shadow-card">
        {/* Logo / cabecera */}
        <div className="mb-6 text-center">
          <span className="text-2xl font-bold text-brand-dark">
            Listo<span className="text-emerald-brand">.cr</span>
          </span>
          <p className="mt-1 text-sm text-brand-muted">Ingresa a tu cuenta</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email */}
          <div>
            <label className="mb-1 block text-sm font-medium text-brand-dark">
              Email
            </label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="w-full rounded-xl border border-brand-border bg-brand-surface px-4 py-3 text-sm text-brand-dark placeholder:text-brand-muted focus:border-emerald-brand focus:outline-none focus:ring-2 focus:ring-emerald-brand/20"
            />
          </div>

          {/* Password */}
          <div>
            <label className="mb-1 block text-sm font-medium text-brand-dark">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPwd ? "text" : "password"}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-brand-border bg-brand-surface px-4 py-3 pr-11 text-sm text-brand-dark placeholder:text-brand-muted focus:border-emerald-brand focus:outline-none focus:ring-2 focus:ring-emerald-brand/20"
              />
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-dark"
              >
                {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-brand px-4 py-3 text-sm font-semibold text-white shadow-emerald transition-all hover:bg-emerald-dark disabled:opacity-60"
          >
            {loading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <LogIn className="h-4 w-4" />
            )}
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-brand-muted">
          ¿No tienes cuenta?{" "}
          <Link href="/registro" className="font-medium text-emerald-brand hover:text-emerald-dark">
            Regístrate gratis
          </Link>
        </p>
      </div>
    </main>
  );
}
