import { LoginLogo } from "./login-logo";
import { LoginForm } from "./login-form";

export function LoginCard() {
  return (
    <div className="w-full max-w-sm">
      <div className="space-y-10">

        <LoginLogo />

        <LoginForm />

      </div>
    </div>
  );
}