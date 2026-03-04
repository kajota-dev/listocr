"use client";

import { useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import StepIdentity from "./StepIdentity";
import StepLeadScoring from "./StepLeadScoring";
import StepAccount from "./StepAccount";
import StepSuccess from "./StepSuccess";
import type { RegisterFormState } from "@/types";

const STEP_LABELS = ["Perfil", "Tu situación", "Tu cuenta", "¡Listo!"];

const INITIAL_STATE: RegisterFormState = {
  step: 1,
  userType: null,
  leadScoreData: {},
  email: "",
  password: "",
  name: "",
  phone: "",
};

export default function RegisterForm() {
  const [state, setState] = useState<RegisterFormState>(INITIAL_STATE);
  const [agencyName, setAgencyName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [direction, setDirection] = useState(1);

  const goTo = (step: RegisterFormState["step"], dir: 1 | -1) => {
    setDirection(dir);
    setState((prev) => ({ ...prev, step }));
  };

  const canAdvanceStep1 = state.userType !== null;
  const canAdvanceStep2 = true; // el lead scoring es opcional
  const canAdvanceStep3 =
    state.name.trim().length > 0 &&
    state.email.includes("@") &&
    state.password.length >= 8;

  const handleRegister = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const body = {
        name: state.name,
        email: state.email,
        password: state.password,
        phone: state.phone,
        userType: state.userType,
        leadScoreData: state.leadScoreData,
        agencyName: state.userType === "agencia" ? agencyName : undefined,
      };

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Error al crear la cuenta");
        return;
      }

      setState((prev) => ({
        ...prev,
        step: 4,
        fichaSlug: json.data?.fichaSlug,
      }));
    } catch {
      setError("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const slideVariants: Variants = {
    enter: (d: number) => ({ opacity: 0, x: d > 0 ? 32 : -32 }),
    center: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit:  (d: number) => ({ opacity: 0, x: d > 0 ? -32 : 32, transition: { duration: 0.3 } }),
  };

  return (
    <div className="mx-auto w-full max-w-md">
      {/* Progress bar */}
      {state.step < 4 && (
        <div className="mb-8">
          <div className="mb-3 flex items-center justify-between">
            {STEP_LABELS.slice(0, 3).map((label, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-all ${
                  i + 1 < state.step
                    ? "bg-emerald-brand text-white"
                    : i + 1 === state.step
                    ? "border-2 border-emerald-brand bg-brand-white text-emerald-brand"
                    : "border-2 border-brand-border bg-brand-white text-brand-muted"
                }`}>
                  {i + 1 < state.step ? (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : i + 1}
                </div>
                <span className={`text-xs ${i + 1 === state.step ? "font-medium text-emerald-brand" : "text-brand-muted"}`}>
                  {label}
                </span>
              </div>
            ))}
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-brand-border">
            <motion.div
              className="h-full rounded-full bg-emerald-brand"
              animate={{ width: `${((state.step - 1) / 2) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>
      )}

      {/* Pasos */}
      <div className="rounded-3xl border border-brand-border bg-brand-white p-8 shadow-card">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={`step-${state.step}`}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            {state.step === 1 && (
              <StepIdentity
                selected={state.userType}
                onSelect={(type) => setState((prev) => ({ ...prev, userType: type }))}
              />
            )}

            {state.step === 2 && state.userType && (
              <StepLeadScoring
                userType={state.userType}
                leadScoreData={state.leadScoreData}
                onChange={(data) => setState((prev) => ({
                  ...prev,
                  leadScoreData: { ...prev.leadScoreData, ...data },
                }))}
              />
            )}

            {state.step === 3 && (
              <StepAccount
                data={{ name: state.name, email: state.email, password: state.password, phone: state.phone }}
                onChange={(field, value) => setState((prev) => ({ ...prev, [field]: value }))}
                agencyName={agencyName}
                onAgencyNameChange={setAgencyName}
                userType={state.userType || "independiente"}
                isLoading={isLoading}
              />
            )}

            {state.step === 4 && (
              <StepSuccess
                userName={state.name}
                fichaSlug={state.fichaSlug || "mi-perfil"}
                userType={state.userType || "independiente"}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Error */}
        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Botones de navegación */}
        {state.step < 4 && (
          <div className={`mt-8 flex ${state.step > 1 ? "justify-between" : "justify-end"}`}>
            {state.step > 1 && (
              <button
                type="button"
                onClick={() => goTo((state.step - 1) as RegisterFormState["step"], -1)}
                className="rounded-xl border border-brand-border px-6 py-2.5 text-sm font-medium text-brand-muted hover:border-brand-dark hover:text-brand-dark transition-colors"
              >
                ← Atrás
              </button>
            )}

            {state.step < 3 && (
              <button
                type="button"
                disabled={state.step === 1 ? !canAdvanceStep1 : !canAdvanceStep2}
                onClick={() => goTo((state.step + 1) as RegisterFormState["step"], 1)}
                className="rounded-xl bg-emerald-brand px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-dark disabled:cursor-not-allowed disabled:opacity-50"
              >
                Continuar →
              </button>
            )}

            {state.step === 3 && (
              <button
                type="button"
                disabled={!canAdvanceStep3 || isLoading}
                onClick={handleRegister}
                className="rounded-xl bg-emerald-brand px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-dark disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? "Creando…" : "Crear mi cuenta →"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
