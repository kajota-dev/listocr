import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-brand-border bg-brand-white px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col items-start justify-between gap-8 md:flex-row">
          {/* Logo y descripción */}
          <div className="max-w-xs">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-brand">
                <span className="text-sm font-bold text-white">L</span>
              </div>
              <span className="text-xl font-bold text-brand-dark">Listo.cr</span>
            </div>
            <p className="text-sm text-brand-muted leading-relaxed">
              La plataforma de identidad digital para agentes inmobiliarios de Costa Rica.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-8">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-brand-muted">Producto</p>
              <ul className="space-y-2">
                <li><a href="#como-funciona" className="text-sm text-brand-muted hover:text-emerald-brand">Cómo funciona</a></li>
                <li><a href="#precios" className="text-sm text-brand-muted hover:text-emerald-brand">Precios</a></li>
              </ul>
            </div>
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-brand-muted">Empresa</p>
              <ul className="space-y-2">
                <li><Link href="/registro" className="text-sm text-brand-muted hover:text-emerald-brand">Registro</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-brand-border pt-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-brand-muted">
            © {new Date().getFullYear()} Listo.cr · Todos los derechos reservados
          </p>
          <p className="text-xs text-brand-muted">
            Hecho con ❤️ en Costa Rica 🇨🇷
          </p>
        </div>
      </div>
    </footer>
  );
}
