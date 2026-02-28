# Case Stage — Frontend

Interface moderna para o sistema de mapeamento e gestão de áreas organizacionais e processos hierárquicos.

## Stack

| Camada       | Tecnologia                                              |
| ------------ | ------------------------------------------------------- |
| Core         | Next.js 16 (App Router) + React 19 + TypeScript estrito |
| Estilização  | Tailwind CSS v4 + shadcn/ui (New York)                  |
| Dados        | TanStack Query v5 + Axios                               |
| Formulários  | React Hook Form + Zod                                   |
| Árvore       | React Flow (@xyflow/react)                              |
| Ícones       | Lucide React                                            |
| Notificações | Sonner (toast)                                          |

## Pré-requisitos

- Node.js >= 20
- Backend rodando em `http://localhost:3333` (ver `../backend/`)

## Setup rápido

```bash
# Instalar dependências
npm install

# Iniciar dev server
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Variáveis de ambiente

Crie um `.env.local` na raiz:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3333
```

## Estrutura de diretórios

```
src/
├── app/                  → Rotas (App Router)
│   ├── page.tsx          → Dashboard
│   ├── areas/            → CRUD de áreas + árvore
│   └── processes/        → Listagem e gestão de processos
├── components/
│   ├── ui/               → Componentes shadcn/ui
│   ├── layout/           → AppShell (sidebar + header)
│   └── providers.tsx     → QueryClient + Tooltip + Toaster
├── features/
│   ├── areas/            → Service, hooks e componentes de áreas
│   └── processes/        → Service, hooks, React Flow e sheet de detalhes
├── hooks/                → Custom hooks globais (metadata)
├── lib/                  → Axios client, query keys, utils
└── types/                → Interfaces compartilhadas
```

## Páginas

| Rota                   | Componente          | Descrição                                                               |
| ---------------------- | ------------------- | ----------------------------------------------------------------------- |
| `/`                    | `DashboardPage`     | Cards com total de áreas, processos e status da API                     |
| `/areas`               | `AreasPage`         | Tabela paginada de áreas, busca, CRUD via dialogs                       |
| `/areas/[id]/tree`     | `AreaTreePage`      | Grafo interativo da árvore de processos (React Flow)                    |
| `/processes`           | `ProcessesPage`     | Tabela paginada com filtros (status, tipo, prioridade, área)            |
| `/processes/new`       | `NewProcessPage`    | Formulário completo de criação de processo                              |
| `/processes/[id]`      | `ProcessDetailPage` | Visualização completa (badges, datas, responsáveis, docs, subprocessos) |
| `/processes/[id]/edit` | `EditProcessPage`   | Formulário preenchido para edição                                       |

## Componentes de Domínio

| Componente           | Localização                                              | Descrição                                                                                                           |
| -------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `ProcessForm`        | `features/processes/components/process-form.tsx`         | Formulário reutilizável para criação e edição de processos com field arrays (ferramentas, responsáveis, documentos) |
| `ProcessTreeFlow`    | `features/processes/components/process-tree-flow.tsx`    | Converte árvore recursiva em nodes/edges do React Flow com layout automático                                        |
| `ProcessNode`        | `features/processes/components/process-node.tsx`         | Nó customizado do grafo com dot de status, ícone de tipo, badges e contadores                                       |
| `ProcessDetailSheet` | `features/processes/components/process-detail-sheet.tsx` | Sheet lateral acionado ao clicar em um nó do grafo, mostrando detalhes completos                                    |
| `AppShell`           | `components/layout/app-shell.tsx`                        | Sidebar de navegação (Dashboard/Áreas/Processos) + header com trigger                                               |
| `Providers`          | `components/providers.tsx`                               | Wrapper global: QueryClientProvider, TooltipProvider, Toaster, DevTools                                             |

## Scripts

| Comando         | Descrição              |
| --------------- | ---------------------- |
| `npm run dev`   | Dev server (Turbopack) |
| `npm run build` | Build de produção      |
| `npm run start` | Serve o build          |
| `npm run lint`  | ESLint                 |

## CORS

O backend precisa de `CORS_ORIGIN` incluindo `http://localhost:3000`.  
No `.env` do backend:

```
CORS_ORIGIN="http://localhost:3000,http://localhost:5173"
```

## Decisões arquiteturais

- **Feature-Sliced Design simplificado** — cada feature encapsula service, hooks e componentes.
- **TanStack Query como SSOT** — sem estado global manual; cache como fonte de verdade.
- **Query key factory** — chaves centralizadas para invalidação previsível.
- **Normalizador de erro** — `extractApiError()` unifica os 3 formatos de erro do backend.
- **React Flow** — nós customizados com status visual e animação nas edges.
