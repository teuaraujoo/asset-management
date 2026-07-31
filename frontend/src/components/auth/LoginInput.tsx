import type { LucideIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Props {
  icon: LucideIcon;
  type?: string;
  placeholder: string;
}

export function LoginInput({
  icon: Icon,
  type = "text",
  placeholder,
}: Props) {
  return (
    <div className="relative">
      <Icon
        className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70"
      />

      <Input
        type={type}
        placeholder={placeholder}
        className="
          h-12
          border-white/70
          bg-transparent
          pl-11
          uppercase
          tracking-wider
          text-white
          placeholder:text-white/60
          focus-visible:ring-2
          focus-visible:ring-white
        "
      />
    </div>
  );
}