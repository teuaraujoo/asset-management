import { Search, Settings } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

export function DashboardHeader() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-background px-6">

      {/* Search */}
      <div className="relative w-full max-w-md">

        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />

        <Input
          placeholder="Pesquisar arquivos..."
          className="
            h-10
            pl-10
            bg-muted/40
            border-border
            focus-visible:ring-primary
          "
        />

      </div>

      {/* Actions */}
      <div className="ml-6 flex items-center gap-5">
        <button
          className="
            text-muted-foreground
            transition-colors
            hover:text-foreground
          "
        >
          <Settings size={20} />
        </button>

        <Avatar className="h-9 w-9 cursor-pointer border border-border">
          <AvatarImage src="/avatar.png" />
          <AvatarFallback>MA</AvatarFallback>
        </Avatar>

      </div>
    </header>
  );
}