import {
  Folder,
  BookText,
  Upload,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const navigation = [
  {
    name: "Projetos",
    icon: Folder,
    href: "/dashboard/projects",
  },
];

const footerNavigation = [
  {
    name: "Documentação",
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
        bg-sidebar
      "
    >
      {/* Logo */}
      <div className="px-5 pt-6 pb-8">
        <img
          src="/logo.png"
          alt="Logomarca"
          className="h-8 w-auto px-5"
        />
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
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-[0_8px_24px_rgba(72,17,237,0.24)]"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
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
                  hover:bg-sidebar-accent
                  hover:text-sidebar-accent-foreground
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
              bg-primary
              text-primary-foreground
              hover:bg-sidebar-primary
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
