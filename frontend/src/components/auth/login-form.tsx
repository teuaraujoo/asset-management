"use client";

import { User, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";

import { LoginInput } from "./login-input";

export function LoginForm() {
  return (
    <form className="space-y-5">

      <LoginInput
        icon={User}
        placeholder="USERNAME"
      />

      <LoginInput
        icon={Lock}
        placeholder="PASSWORD"
        type="password"
      />

      <div className="pt-3">
        <Button
          className="h-12 w-full rounded-xl bg-white text-lg font-bold uppercase text-[#2F4BCB] hover:bg-gray-100"
        >
          Login
        </Button>
      </div>

    </form>
  );
}