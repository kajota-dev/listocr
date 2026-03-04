"use client";

import { useState } from "react";
import { Eye, EyeOff, User, Mail, Lock, Phone } from "lucide-react";
import type { RegisterFormState } from "@/types";

interface StepAccountProps {
  data: Pick<RegisterFormState, "name" | "email" | "password" | "phone">;
  onChange: (field: keyof Pick<RegisterFormState, "name" | "email" | "password" | "phone">, value: string) => void;
  agencyName?: string;
  onAgencyNameChange?: (v: string) => void;
  userType: "independiente" | "agencia";
  isLoading: boolean;
}

interface InputFieldProps {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  icon: React.ReactNode;
  required?: boolean;
  suffix?: React.ReactNode;
}

function InputField({ label, type = "text", value, onChange, placeholder, icon, required, suffix }: InputFieldProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-brand-dark">{label}</label>
      <div className="relative flex items-center">
        <div className="pointer-events-none absolute left-4 text-brand-muted">{icon}</div>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="w-full rounded-xl border border-brand-border bg-brand-white py-3 pl-11 pr-4 text-sm text-brand-dark placeholder:text-brand-muted/50 transition-colors focus:border-emerald-brand focus:outline-none focus:ring-2 focus:ring-emerald-brand/20"
        />
        {suffix && <div className="absolute right-3">{suffix}</div>}
      </div>
    </div>
  );
}

export default function StepAccount({
  data,
  onChange,
  agencyName,
  onAgencyNameChange,
  userType,
  isLoading,
}: StepAccountProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  return (
    <div>
      <h2 className="mb-2 text-2xl font-bold text-brand-dark">Crea tu cuenta</h2>
      <p className="mb-8 text-brand-muted">
        Tus datos están protegidos. Nunca los compartimos.
      </p>

      <div className="flex flex-col gap-5">
        {/* Nombre de agencia (solo si es agencia) */}
        {userType === "agencia" && onAgencyNameChange && (
          <InputField
            label="Nombre de la agencia"
            value={agencyName || ""}
            onChange={onAgencyNameChange}
            placeholder="Ej: Costa Sol Bienes Raíces"
            icon={<User className="h-4 w-4" />}
            required
          />
        )}

        <InputField
          label="Tu nombre completo"
          value={data.name}
          onChange={(v) => onChange("name", v)}
          placeholder="Ej: María José Arias"
          icon={<User className="h-4 w-4" />}
          required
        />

        <InputField
          label="WhatsApp (opcional)"
          type="tel"
          value={data.phone}
          onChange={(v) => onChange("phone", v)}
          placeholder="+506 8888 7777"
          icon={<Phone className="h-4 w-4" />}
        />

        <InputField
          label="Correo electrónico"
          type="email"
          value={data.email}
          onChange={(v) => onChange("email", v)}
          placeholder="tu@correo.com"
          icon={<Mail className="h-4 w-4" />}
          required
        />

        <div>
          <label className="mb-2 block text-sm font-medium text-brand-dark">Contraseña</label>
          <div className="relative flex items-center">
            <div className="pointer-events-none absolute left-4 text-brand-muted">
              <Lock className="h-4 w-4" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={data.password}
              onChange={(e) => onChange("password", e.target.value)}
              placeholder="Mínimo 8 caracteres"
              required
              minLength={8}
              className="w-full rounded-xl border border-brand-border bg-brand-white py-3 pl-11 pr-12 text-sm text-brand-dark placeholder:text-brand-muted/50 transition-colors focus:border-emerald-brand focus:outline-none focus:ring-2 focus:ring-emerald-brand/20"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-brand-muted hover:text-brand-dark transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {data.password && data.password.length < 8 && (
            <p className="mt-1 text-xs text-red-500">Mínimo 8 caracteres</p>
          )}
        </div>

        {/* Términos */}
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-brand-border accent-emerald-brand"
          />
          <span className="text-sm text-brand-muted">
            Acepto los{" "}
            <a href="#" className="text-emerald-brand hover:underline">términos de uso</a>{" "}
            y la{" "}
            <a href="#" className="text-emerald-brand hover:underline">política de privacidad</a>
          </span>
        </label>
      </div>

      {/* Estado de carga */}
      {isLoading && (
        <div className="mt-6 flex items-center justify-center gap-3 text-emerald-brand">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-brand border-t-transparent" />
          <span className="text-sm font-medium">Creando tu ficha digital…</span>
        </div>
      )}
    </div>
  );
}
