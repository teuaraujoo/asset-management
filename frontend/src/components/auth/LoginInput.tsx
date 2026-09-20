import { useState, type HTMLInputTypeAttribute } from "react";
import { Eye, EyeOff, type LucideIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { UseFormRegisterReturn } from "react-hook-form";

interface Props {
  icon: LucideIcon;
  type?: HTMLInputTypeAttribute;
  registration: UseFormRegisterReturn;
  label: string;
  placeholder: string;
  error?: string;
  autoComplete?: string;
}

export function LoginInput({
  icon: Icon,
  type = "text",
  registration,
  label,
  placeholder,
  error,
  autoComplete,
}: Props) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const isPassword = type === "password";
  const inputId = `login-${registration.name}`;

  return (
    <div className="space-y-2">
      <label htmlFor={inputId} className="block text-sm font-medium text-[#ded8e8]">
        {label}
      </label>

      <div className="relative">
        <Icon
          className="absolute left-4 top-1/2 z-10 h-[18px] w-[18px] -translate-y-1/2 text-[#a996d6]"
          aria-hidden="true"
        />

        <Input
          {...registration}
          id={inputId}
          type={isPassword && passwordVisible ? "text" : type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className="h-12 border-white/10 bg-white/[0.045] pl-11 pr-12 text-[#f8f5ff] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] placeholder:text-[#7e748b] focus-visible:border-[#8f6cff]/70 focus-visible:bg-white/[0.065] focus-visible:ring-2 focus-visible:ring-[#7649fa]/25"
        />

        {isPassword ? (
          <button
            type="button"
            onClick={() => setPasswordVisible((visible) => !visible)}
            className="absolute right-2.5 top-1/2 flex size-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-[#968ba3] transition-colors hover:bg-white/[0.06] hover:text-[#f8f5ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7649fa]"
            aria-label={passwordVisible ? "Ocultar senha" : "Mostrar senha"}
            aria-pressed={passwordVisible}
          >
            {passwordVisible ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
          </button>
        ) : null}
      </div>

      <div className="min-h-5 px-1">
        {error && (
          <p id={`${inputId}-error`} className="text-sm text-[#ff8490]" role="alert">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
