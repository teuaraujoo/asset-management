import {
  Folder,
  BookText,
  Upload,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const navigation = [
  {
    name: "Projects",
    icon: Folder,
    href: "/dashboard/projects",
  },
];

const footerNavigation = [
  {
    name: "Documentation",
    icon: BookText,
    href: "/documentation",
  },
];

export function DashboardSidebar() {
  const navigate = useNavigate();

  return (
    <aside
      className="
        flex
        h-screen
        w-64
        flex-col
        border-r
        border-border
        bg-background
      "
    >
      {/* Logo */}
      <div className="px-5 pt-6 pb-8">
        <h1 className="text-xl font-bold tracking-tight">
          Teteu Asset Manager
        </h1>

        <p className="mt-1 text-xs text-muted-foreground">
          Assets de projetos pessoais
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col px-3">
        <div className="space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end={item.href === "/"}
              className={({ isActive }) =>
                `
                group
                flex
                items-center
                gap-3
                rounded-lg
                px-3
                py-2.5
                text-sm
                font-medium
                transition-all
                ${isActive
                  ? "bg-blue-600 text-primary-foreground"
                  : "text-muted-foreground hover:bg-blue-100 hover:text-foreground"
                }
              `
              }
            >
              <item.icon size={18} />

              <span>{item.name}</span>
            </NavLink>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-auto pb-4">
          <div className="mb-4 border-t border-border" />

          <div className="space-y-1">
            {footerNavigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className="
                  flex
                  items-center
                  gap-3
                  rounded-lg
                  px-3
                  py-2.5
                  text-sm
                  font-medium
                  text-muted-foreground
                  transition-all
                  hover:bg-blue-100
                  hover:text-foreground
                "
              >
                <item.icon size={18} />

                <span>{item.name}</span>
              </NavLink>
            ))}
          </div>

          <Button
            className="
              mt-6
              h-11
              w-full
              gap-2
              bg-blue-600
              hover:bg-blue-800
              cursor-pointer
            "
            onClick={() => navigate("/dashboard/projects?upload=true")}
          >
            <Upload size={18} />

            Upload Arquivos
          </Button>
        </div>
      </nav>
    </aside>
  );
}