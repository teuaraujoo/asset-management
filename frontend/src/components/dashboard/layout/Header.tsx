import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { AvatarDropdown } from "./AvatarDropwDown";
import { logout } from "@/services/auth.services";
import { useNavigate } from "react-router-dom";

export function DashboardHeader() {
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/");
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-background px-6">

      <div className="relative w-full max-w-md">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />

        <Input
          placeholder="Pesquisar arquivos..."
          className="h-10 pl-10 bg-muted/40 border-border focus-visible:ring-primary"
        />
      </div>

      <div className="ml-6 flex items-center gap-5">
        <div className="flex items-center gap-4">
          <AvatarDropdown
            user={{
              name: "Mateus Araujo",
              email: "mateus@email.com",
            }}
            onLogout={handleLogout}
          />
        </div>
      </div>
    </header>
  );
}