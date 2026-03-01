/**
 * Providers globais da aplicação.
 *
 * Envolve toda a árvore de componentes com:
 * - **QueryClientProvider** (TanStack Query) — cache e estado do servidor
 * - **ThemeProvider** (next-themes) — suporte a dark/light mode
 * - **TooltipProvider** (Radix) — tooltips globais
 * - **Toaster** (Sonner) — notificações toast
 * - **ReactQueryDevtools** — debug do cache em desenvolvimento
 */
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { useState, type ReactNode } from "react";

/**
 * Provider global da aplicação.
 * Inicializa:
 * - QueryClient com staleTime de 1 minuto, 1 retry e sem refetch on focus
 * - TooltipProvider para tooltips acessíveis (Radix UI)
 * - Toaster (Sonner) para notificações toast no canto superior direito
 * - React Query DevTools (apenas em desenvolvimento)
 */
export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60, // 1 min
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <TooltipProvider delayDuration={300}>
          {children}
          <Toaster richColors position="top-right" closeButton />
        </TooltipProvider>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
