import Link from "next/link";

export default function NotFoundProfile() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-brand-surface px-6 text-center">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-muted">
        <span className="text-4xl">🔍</span>
      </div>
      <h1 className="mb-3 text-3xl font-bold text-brand-dark">
        Perfil no encontrado
      </h1>
      <p className="mb-8 max-w-sm text-brand-muted">
        Este agente no existe o su perfil ha sido desactivado. Si crees que es un error, contacta a{" "}
        <span className="font-semibold text-emerald-brand">Listo.cr</span>.
      </p>
      <Link
        href="/"
        className="rounded-2xl bg-emerald-brand px-6 py-3 font-semibold text-white transition-colors hover:bg-emerald-dark"
      >
        Ir al inicio
      </Link>
    </div>
  );
}
