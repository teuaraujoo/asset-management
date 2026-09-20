import { LoaderCircle, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoginInput } from "./LoginInput";
import { useLoginForm } from "@/hooks/auth/use-login-fom";

export function LoginForm() {
  const {
    form,
    handleLogin,
    loading,
  } = useLoginForm();

  return (
    <form
      onSubmit={form.handleSubmit((data) => handleLogin(data))}
      className="login-reveal login-reveal-form mt-8 space-y-1"
    >
      <div>
        <LoginInput
          icon={Mail}
          registration={form.register("email")}
          label="E-mail"
          placeholder="seu@email.com"
          autoComplete="email"
          error={form.formState.errors.email?.message}
        />

        <LoginInput
          icon={Lock}
          label="Senha"
          placeholder="Digite sua senha"
          registration={form.register("password")}
          type="password"
          autoComplete="current-password"
          error={form.formState.errors.password?.message}
        />
      </div>

      {form.formState.errors.root && (
        <p className="mb-4 rounded-lg border border-[#f05d68]/25 bg-[#f05d68]/10 px-3 py-2.5 text-sm text-[#ff9ca5]" role="alert">
          {form.formState.errors.root.message}
        </p>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="login-submit-button h-12 w-full rounded-xl bg-[#7649fa] text-base font-semibold text-white shadow-[0_12px_35px_rgba(72,17,237,0.28)] hover:bg-[#825afa] disabled:opacity-70"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
            Entrando...
          </span>
        ) : "Entrar"}
      </Button>
    </form>
  );
}
