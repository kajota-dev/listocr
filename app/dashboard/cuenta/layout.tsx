// Layout especial para /dashboard/cuenta/* — sin sidebar, accesible incluso
// cuando la suscripción esté vencida (el layout principal redirige a estas páginas)
export default function CuentaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-surface p-4">
      {children}
    </div>
  );
}
