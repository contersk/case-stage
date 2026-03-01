# Components

Componentes React compartilhados por toda a aplicação.

## Estrutura

```
components/
├── providers.tsx      → Providers globais (QueryClient, Theme, Toaster)
├── layout/
│   ├── index.ts        → Barrel export
│   ├── app-shell.tsx   → Layout principal (Sidebar + Header + Main)
│   └── app-breadcrumb.tsx → Breadcrumb automático baseado na rota
└── ui/                 → Componentes shadcn/ui (primitivos de interface)
```

## `providers.tsx`

Configura todos os providers que envolvem a aplicação:

- **QueryClientProvider** — cache do TanStack Query (`staleTime: 1min`, `retry: 1`)
- **ThemeProvider** — dark/light mode via `next-themes`
- **TooltipProvider** — tooltips globais do Radix
- **Toaster** — notificações toast (Sonner) no canto superior direito
- **ReactQueryDevtools** — painel de debug do cache (apenas dev)

## `layout/`

### `app-shell.tsx`

Layout padrão da aplicação com:

- **Sidebar colapsável** com navegação (Dashboard, Áreas, Processos)
- **Header** com breadcrumb automático e toggle de tema
- **Main area** com scroll e padding

### `app-breadcrumb.tsx`

Gera breadcrumbs automaticamente baseado no pathname da rota atual.

## `ui/`

Componentes do [shadcn/ui](https://ui.shadcn.com/) — primitivos de interface prontos para uso:

| Componente      | Descrição                                     |
| --------------- | --------------------------------------------- |
| `badge`         | Badges/chips de informação                    |
| `button`        | Botões com variantes (default, outline, etc.) |
| `card`          | Cards com header, content e footer            |
| `dialog`        | Modais acessíveis                             |
| `dropdown-menu` | Menus dropdown                                |
| `input`         | Input de texto                                |
| `label`         | Labels de formulário                          |
| `select`        | Select com combobox                           |
| `separator`     | Divisor horizontal/vertical                   |
| `sheet`         | Painel lateral deslizante                     |
| `sidebar`       | Sidebar colapsável                            |
| `skeleton`      | Skeleton loading                              |
| `status-badge`  | Badges customizados de Status/Prioridade/Tipo |
| `table`         | Tabela com header, body e footer              |
| `textarea`      | Textarea                                      |
| `theme-toggle`  | Toggle dark/light mode                        |
| `tooltip`       | Tooltips acessíveis                           |
| `breadcrumb`    | Breadcrumb com separadores                    |

> Os componentes `ui/` seguem o padrão shadcn: copie e personalize. Não são instalados via npm.
