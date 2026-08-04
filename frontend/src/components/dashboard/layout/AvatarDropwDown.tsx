import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import {
  ChevronDown,
  LogOut,
  Settings,
  User,
} from "lucide-react";

type AvatarDropdownProps = {
  user: {
    name: string;
    email: string;
  };

  onLogout: () => void | Promise<void>;
};

export function AvatarDropdown({
  user,
  onLogout,
}: AvatarDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        type="button"
        className="flex h-auto items-center gap-3 rounded-md px-2 py-1 text-left outline-none hover:bg-accent/50 focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Avatar className="h-9 w-9">
          <AvatarFallback>
            {user.name
              .split(" ")
              .map((name) => name[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="hidden text-left md:block">
          <p className="text-sm font-medium leading-none">{user.name}</p>
          <p className="mt-1 text-xs text-muted-foreground">{user.email}</p>
        </div>

        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        side="bottom"
        className="w-64 rounded-xl border bg-background p-2 shadow-lg"
      >
        <div className="px-3 py-2">
          <p className="font-medium">{user.name}</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 hover:bg-accent">
          <User size={16} />
          Meu Perfil
        </DropdownMenuItem>

        <DropdownMenuItem className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 hover:bg-accent">
          <Settings size={16} />
          Configurações
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => void onLogout()}
          className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-red-600 hover:bg-red-50 focus:bg-red-50 focus:text-red-600"
        >
          <LogOut size={16} />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}