"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderTree,
  GitBranch,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarInset,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { AppBreadcrumb } from "@/components/layout/app-breadcrumb";
import type { ReactNode } from "react";

/** Itens de navegação do sidebar. Cada item mapeia para uma rota da aplicação. */
const navItems = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "Áreas", href: "/areas", icon: FolderTree },
  { title: "Processos", href: "/processes", icon: GitBranch },
];

/**
 * Botão flutuante na borda externa da sidebar.
 * Segue o padrão de mercado (Linear, Notion, VS Code):
 * - Aparece no meio-vertical da borda direita da sidebar
 * - Ícone muda conforme estado aberto/fechado
 * - Tooltip com dica de ação
 */
function SidebarEdgeToggle() {
  const { open, toggleSidebar } = useSidebar();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSidebar}
          className="absolute -right-3 top-1/2 z-30 h-6 w-6 -translate-y-1/2 rounded-full border bg-background shadow-sm hover:bg-accent transition-colors"
        >
          {open ? (
            <PanelLeftClose className="h-3 w-3" />
          ) : (
            <PanelLeftOpen className="h-3 w-3" />
          )}
          <span className="sr-only">
            {open ? "Recolher menu" : "Expandir menu"}
          </span>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right" sideOffset={8}>
        {open ? "Recolher menu" : "Expandir menu"}
      </TooltipContent>
    </Tooltip>
  );
}

function AppSidebar() {
  const pathname = usePathname();

  return (
    <div className="relative">
      <Sidebar variant="inset" collapsible="icon">
        <SidebarHeader className="border-b px-4 py-3">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-lg"
          >
            <GitBranch className="h-5 w-5 text-primary" />
            <span className="group-data-[collapsible=icon]:hidden">
              Case Stage
            </span>
          </Link>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navegação</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                    >
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <SidebarEdgeToggle />
    </div>
  );
}

/**
 * Layout principal da aplicação (App Shell).
 * Renderiza a estrutura: Sidebar (navegação) + Header (breadcrumb + tema) + Main (conteúdo da página).
 * Toggle da sidebar é um botão circular flutuante na borda externa.
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 items-center gap-2 border-b px-4">
          <AppBreadcrumb />
          <div className="ml-auto flex items-center gap-1">
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
