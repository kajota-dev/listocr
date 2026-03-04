export default function LoadingProfile() {
  return (
    <div className="mx-auto max-w-md animate-pulse">
      {/* Cover skeleton */}
      <div className="h-44 w-full bg-brand-border" />

      <div className="bg-brand-white px-5 pb-6">
        {/* Avatar skeleton */}
        <div className="-mt-12 mb-4">
          <div className="h-24 w-24 rounded-full border-4 border-white bg-brand-border" />
        </div>

        {/* Nombre skeleton */}
        <div className="mb-2 h-7 w-48 rounded-lg bg-brand-border" />
        <div className="mb-4 h-4 w-32 rounded-lg bg-brand-border" />

        {/* Bio skeleton */}
        <div className="mb-2 h-4 w-full rounded-lg bg-brand-border" />
        <div className="mb-4 h-4 w-3/4 rounded-lg bg-brand-border" />

        {/* Botón skeleton */}
        <div className="h-14 w-full rounded-2xl bg-brand-border" />
      </div>

      {/* Propiedades skeleton */}
      <div className="mt-4 px-4">
        <div className="mb-4 h-6 w-32 rounded-lg bg-brand-border" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="overflow-hidden rounded-2xl border border-brand-border bg-brand-white">
              <div className="h-44 w-full bg-brand-border" />
              <div className="p-4">
                <div className="mb-2 h-4 w-24 rounded-lg bg-brand-border" />
                <div className="mb-2 h-5 w-full rounded-lg bg-brand-border" />
                <div className="mb-3 h-6 w-32 rounded-lg bg-brand-border" />
                <div className="h-10 w-full rounded-xl bg-brand-border" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
