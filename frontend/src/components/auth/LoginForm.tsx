import { User, Lock } from "lucide-react";
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
    <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-5">
      <LoginInput
        icon={User}
        registration={form.register("email")}
        placeholder="EMAIL"
        error={form.formState.errors.email?.message}
      />

      <LoginInput
        icon={Lock}
        placeholder="PASSWORD"
        registration={form.register("password")}
        type="password"
        error={form.formState.errors.password?.message}
      />

      {form.formState.errors.root && (
        <p className="text-sm text-destructive">
          {form.formState.errors.root.message}
        </p>
      )}

      <div className="pt-3">
        <Button
          type="submit"
          disabled={loading}
          className="cursor-pointer h-12 w-full rounded-xl bg-white text-lg font-bold uppercase text-[#2F4BCB] hover:bg-gray-100"
        >
          {loading ? "Carregando" : "Login"}
        </Button>
      </div>
    </form>
  );
}