"use client";

import { useState, useCallback } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Copy, Check, Save, User } from "lucide-react";
import type { IPublicProfile } from "@/types";

interface ProfileEditorProps {
  initialProfile: IPublicProfile;
  fichaSlug: string;
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://listo.cr";

export default function ProfileEditor({ initialProfile, fichaSlug }: ProfileEditorProps) {
  const [profile, setProfile] = useState<IPublicProfile>(initialProfile);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"editor" | "preview">("editor");

  const fichaUrl = `${APP_URL}/u/${fichaSlug}`;

  const updateField = useCallback(<K extends keyof IPublicProfile>(
    field: K,
    value: IPublicProfile[K]
  ) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  }, []);

  const updateSocialLink = useCallback((network: keyof IPublicProfile["socialLinks"], value: string) => {
    setProfile((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [network]: value || null },
    }));
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { totalViews, totalClicks, lastViewedAt, ...editableProfile } = profile;
      void totalViews; void totalClicks; void lastViewedAt;

      await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editableProfile),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(fichaUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const InputRow = ({ label, field, placeholder, type = "text" }: {
    label: string; field: keyof IPublicProfile; placeholder?: string; type?: string;
  }) => (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-brand-dark">{label}</label>
      <input
        type={type}
        value={String(profile[field] ?? "")}
        onChange={(e) => updateField(field, e.target.value as IPublicProfile[typeof field])}
        placeholder={placeholder}
        className="w-full rounded-xl border border-brand-border bg-brand-white px-4 py-2.5 text-sm text-brand-dark placeholder:text-brand-muted/40 transition-colors focus:border-emerald-brand focus:outline-none focus:ring-2 focus:ring-emerald-brand/20"
      />
    </div>
  );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-brand-dark">Tu Identidad Digital</h2>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 rounded-xl bg-emerald-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-dark disabled:opacity-60"
        >
          {saved ? (
            <><Check className="h-4 w-4" /> Guardado</>
          ) : isSaving ? (
            <><div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> Guardando…</>
          ) : (
            <><Save className="h-4 w-4" /> Guardar</>
          )}
        </button>
      </div>

      {/* Tabs (mobile) */}
      <div className="mb-6 flex rounded-xl border border-brand-border bg-brand-surface p-1 lg:hidden">
        {(["editor", "preview"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
              activeTab === tab ? "bg-brand-white text-brand-dark shadow-sm" : "text-brand-muted"
            }`}
          >
            {tab === "editor" ? "Editor" : "Vista previa"}
          </button>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Editor */}
        <div className={`space-y-6 ${activeTab === "preview" ? "hidden lg:block" : ""}`}>
          {/* Identidad */}
          <section className="rounded-2xl border border-brand-border bg-brand-white p-6">
            <h3 className="mb-4 text-base font-bold text-brand-dark">Identidad</h3>
            <div className="space-y-4">
              <InputRow label="Nombre que aparecerá en tu perfil" field="displayName" placeholder="Tu nombre completo" />
              <div>
                <label className="mb-1.5 block text-sm font-medium text-brand-dark">
                  Bio <span className="text-brand-muted">({String(profile.bio || "").length}/300)</span>
                </label>
                <textarea
                  value={profile.bio || ""}
                  onChange={(e) => updateField("bio", e.target.value.slice(0, 300))}
                  placeholder="Cuéntale a tus clientes quién eres y en qué te especializas…"
                  rows={3}
                  className="w-full rounded-xl border border-brand-border bg-brand-white px-4 py-2.5 text-sm text-brand-dark placeholder:text-brand-muted/40 transition-colors focus:border-emerald-brand focus:outline-none focus:ring-2 focus:ring-emerald-brand/20 resize-none"
                />
              </div>
              <InputRow label="URL de foto de perfil" field="avatarUrl" placeholder="https://..." type="url" />
              <InputRow label="URL de imagen de portada" field="coverImageUrl" placeholder="https://..." type="url" />
            </div>
          </section>

          {/* Contacto */}
          <section className="rounded-2xl border border-brand-border bg-brand-white p-6">
            <h3 className="mb-4 text-base font-bold text-brand-dark">Contacto</h3>
            <div className="space-y-4">
              <InputRow label="Número de WhatsApp" field="whatsappNumber" placeholder="50688887777" type="tel" />
              <div>
                <label className="mb-1.5 block text-sm font-medium text-brand-dark">Mensaje pre-cargado de WhatsApp</label>
                <textarea
                  value={profile.whatsappMessage || ""}
                  onChange={(e) => updateField("whatsappMessage", e.target.value)}
                  placeholder="Hola, vi tu perfil en Listo.cr…"
                  rows={2}
                  className="w-full rounded-xl border border-brand-border bg-brand-white px-4 py-2.5 text-sm text-brand-dark placeholder:text-brand-muted/40 transition-colors focus:border-emerald-brand focus:outline-none focus:ring-2 focus:ring-emerald-brand/20 resize-none"
                />
              </div>
              <InputRow label="Email público (opcional)" field="email" placeholder="contacto@ejemplo.com" type="email" />
            </div>
          </section>

          {/* Redes sociales */}
          <section className="rounded-2xl border border-brand-border bg-brand-white p-6">
            <h3 className="mb-4 text-base font-bold text-brand-dark">Redes Sociales</h3>
            <div className="space-y-4">
              {(["instagram", "facebook", "linkedin", "tiktok", "website"] as const).map((network) => (
                <div key={network}>
                  <label className="mb-1.5 block text-sm font-medium capitalize text-brand-dark">
                    {network === "website" ? "Sitio web" : network}
                  </label>
                  <input
                    type="url"
                    value={profile.socialLinks?.[network] || ""}
                    onChange={(e) => updateSocialLink(network, e.target.value)}
                    placeholder={`https://${network === "website" ? "tusitioweb.com" : network + ".com/tu-perfil"}`}
                    className="w-full rounded-xl border border-brand-border bg-brand-white px-4 py-2.5 text-sm text-brand-dark placeholder:text-brand-muted/40 transition-colors focus:border-emerald-brand focus:outline-none focus:ring-2 focus:ring-emerald-brand/20"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Tu QR */}
          <section className="rounded-2xl border border-emerald-brand/30 bg-emerald-muted/20 p-6">
            <h3 className="mb-1 text-base font-bold text-brand-dark">Tu Código QR</h3>
            <p className="mb-5 text-sm text-brand-muted">
              Este QR siempre apunta a tu perfil. Si actualizas tus datos, el QR no cambia.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <div className="rounded-2xl border border-brand-border bg-brand-white p-4 shadow-card animate-glow-pulse">
                <QRCodeSVG value={fichaUrl} size={120} fgColor="#10b981" bgColor="#ffffff" level="M" />
              </div>
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 rounded-xl border border-brand-border bg-brand-white px-4 py-2.5 text-sm font-medium text-brand-dark hover:border-emerald-brand hover:text-emerald-brand transition-colors"
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-brand" /> : <Copy className="h-4 w-4" />}
                  {copied ? "¡Copiado!" : "Copiar link"}
                </button>
                <a
                  href={fichaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-xl border border-brand-border bg-brand-white px-4 py-2.5 text-sm font-medium text-brand-dark hover:border-emerald-brand hover:text-emerald-brand transition-colors"
                >
                  Ver mi perfil ↗
                </a>
              </div>
            </div>
            <p className="mt-4 text-xs text-brand-muted text-center">{fichaUrl}</p>
          </section>
        </div>

        {/* Preview */}
        <div className={`${activeTab === "editor" ? "hidden lg:block" : ""}`}>
          <div className="sticky top-8 rounded-2xl border border-brand-border bg-brand-surface p-3">
            <p className="mb-3 text-center text-xs font-medium text-brand-muted">Vista previa de tu perfil</p>
            <div className="overflow-hidden rounded-xl border border-brand-border bg-brand-white">
              {/* Mini preview del perfil */}
              <div className="h-24 bg-gradient-to-r from-emerald-brand to-emerald-light" />
              <div className="px-5 pb-5 pt-0">
                <div className="-mt-10 mb-3">
                  <div className="h-20 w-20 overflow-hidden rounded-full border-4 border-white bg-emerald-muted shadow-lg">
                    {profile.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={profile.avatarUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <User className="h-8 w-8 text-emerald-brand" />
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-lg font-bold text-brand-dark">{profile.displayName || "Tu nombre"}</p>
                <p className="mb-2 text-sm text-emerald-brand">Agente Inmobiliario</p>
                {profile.bio && (
                  <p className="mb-4 text-sm text-brand-muted leading-relaxed line-clamp-3">{profile.bio}</p>
                )}
                <div className="h-12 w-full rounded-xl bg-emerald-brand" />
                <p className="mt-2 text-center text-xs text-brand-muted">Botón de WhatsApp</p>
              </div>
            </div>
            <p className="mt-3 text-center text-xs text-brand-muted">
              Actualiza los campos para ver los cambios
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
