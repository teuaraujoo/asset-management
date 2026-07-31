import { LoginLogo } from "./LoginLogo";
import { LoginForm } from "./LoginForm";

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