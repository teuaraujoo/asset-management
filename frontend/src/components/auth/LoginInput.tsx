import type { LucideIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { UseFormRegisterReturn } from "react-hook-form";

interface Props {
  icon: LucideIcon;
  name: string;
  type?: string;
  registration: UseFormRegisterReturn;
  placeholder: string;
  error?: string;
}

export function LoginInput({
  icon: Icon,
  name,
  type = "text",
  registration,
  placeholder,
  error
}: Props) {
  return (

    <div className="relative">
      <Icon
        className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70"
      />

      <Input
        {...registration}
        type={type}
        placeholder={placeholder}
        name={name}
        className="
          h-12
          border-white/70
          bg-transparent
          pl-11
          tracking-wider
          text-white
          placeholder:text-white/60
          focus-visible:ring-2
          focus-visible:ring-white
        "
      />

      {error && (
        <p className="mt-1 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}