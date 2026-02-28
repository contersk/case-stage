# Case Stage — Sistema de Mapeamento de Processos Organizacionais

Sistema fullstack para **mapeamento e gestão de processos organizacionais hierárquicos**, permitindo criar áreas, processos com subprocessos em árvore, responsáveis, ferramentas e documentos vinculados, além de uma visualização interativa em grafo.

---

## Visão Geral

O **Case Stage** é composto por duas aplicações independentes:

| Camada       | Tecnologia Principal                   | Porta Padrão |
| ------------ | -------------------------------------- | ------------ |
| **Backend**  | Express 5 + Prisma 6 + PostgreSQL      | `3333`       |
| **Frontend** | Next.js 16 + React 19 + TanStack Query | `3000`       |

### Principais Funcionalidades

- **CRUD completo de Áreas**: criar, listar (paginado + filtro), editar e excluir áreas organizacionais.
- **CRUD completo de Processos**: criar, listar (paginado + multi-filtro), editar e excluir processos com enums de status, tipo e prioridade.
- **Hierarquia de processos (árvore)**: processos possuem auto-referência (`parentId`) formando uma árvore pai → filhos recursiva.
- **Visualização em grafo interativo**: React Flow renderiza a árvore de processos de uma área com zoom, pan, minimap e seleção de nós.
- **Entidades relacionadas por processo**: ferramentas, responsáveis (com cargo) e documentos (com URL).
- **Metadados visuais**: endpoints de metadados retornam cores, ícones e labels para status, tipo e prioridade.
- **Dashboard**: visão geral com contadores de áreas, processos e status da API.
- **Documentação Swagger**: disponível em `/api-docs`.

---

## Arquitetura

```
case-stage/
├── backend/           ← API REST (Express + Prisma + PostgreSQL)
│   ├── src/
│   │   ├── index.ts                     # Entry point do servidor
│   │   └── server/
│   │       ├── Server.ts                # Configuração do Express
│   │       ├── swaggerConfig.ts         # Documentação OpenAPI 3.0
│   │       ├── routes/index.ts          # Definição de todas as rotas
│   │       ├── controllers/             # Validação Zod + handlers (areas/, processes/)
│   │       ├── database/
│   │       │   ├── models/              # Interfaces TypeScript dos modelos
│   │       │   ├── prisma/              # Schema Prisma + migrações
│   │       │   ├── prisma.ts            # Instância do PrismaClient
│   │       │   └── services/            # Regras de negócio (areas/, processes/)
│   │       ├── repositories/            # Acesso direto ao banco via Prisma
│   │       └── shared/
│   │           ├── middleware/           # Validação genérica Zod + Error handler global
│   │           └── utils/               # Erros customizados (AppError, NotFoundError, etc.)
│   └── tests/                           # Testes com Vitest + Supertest
│
├── frontend/          ← Interface Web (Next.js App Router)
│   └── src/
│       ├── app/                         # Páginas (App Router)
│       │   ├── page.tsx                 # Dashboard
│       │   ├── areas/                   # Listagem + Árvore de processos
│       │   └── processes/               # CRUD + Detalhes de processos
│       ├── features/                    # Módulos de domínio
│       │   ├── areas/                   # Service + Hooks (useAreas, useCreateArea, etc.)
│       │   └── processes/               # Service + Hooks + Componentes especializados
│       ├── components/                  # UI Components (shadcn/ui) + Layout + Providers
│       ├── hooks/                       # Hooks globais (useMetadata, useIsMobile)
│       ├── lib/                         # Axios, queryKeys, metadataService, utils
│       └── types/                       # Interfaces TypeScript compartilhadas
│
└── README.md          ← Este arquivo
```

---

## Modelo de Dados

O banco PostgreSQL contém **5 tabelas** conectadas:

```
┌──────────┐       1:N       ┌───────────┐       1:N       ┌────────────┐
│   Area   │ ───────────────▶│  Process   │ ───────────────▶│    Tool    │
│          │                 │            │                 │            │
│ id (PK)  │                 │ id (PK)    │                 │ id (PK)    │
│ name     │                 │ title      │                 │ name       │
└──────────┘                 │ description│                 └────────────┘
                             │ type       │       1:N       ┌────────────┐
                             │ status     │ ───────────────▶│Responsible │
                             │ priority   │                 │            │
                             │ startDate  │                 │ id (PK)    │
                             │ endDate    │                 │ name       │
                             │ areaId(FK) │                 │ role       │
                             │ parentId   │──┐              └────────────┘
                             │ (FK, self) │  │    1:N       ┌────────────┐
                             └────────────┘  │ ──────────▶  │  Document  │
                                  ▲          │              │            │
                                  └──────────┘              │ id (PK)    │
                               auto-referência              │ title      │
                               (árvore hierárquica)         │ url        │
                                                            └────────────┘
```

### Enums

| Enum               | Valores                                               |
| ------------------ | ----------------------------------------------------- |
| `process_type`     | `Sistemico`, `Manual`                                 |
| `process_status`   | `Planejado`, `Em_Andamento`, `Concluido`, `Cancelado` |
| `process_priority` | `Alta`, `Media`, `Baixa`                              |

---

## Endpoints da API

### Áreas

| Método   | Rota              | Descrição                                         |
| -------- | ----------------- | ------------------------------------------------- |
| `GET`    | `/areas`          | Lista paginada (query: `page`, `limit`, `filter`) |
| `GET`    | `/areas/:id`      | Detalhes de uma área por ID                       |
| `GET`    | `/areas/:id/tree` | Árvore hierárquica de processos da área           |
| `POST`   | `/areas`          | Cria nova área (body: `name`)                     |
| `PUT`    | `/areas/:id`      | Atualiza área (body: `name`)                      |
| `DELETE` | `/areas/:id`      | Remove área (cascade nos processos)               |

### Processos

| Método   | Rota             | Descrição                                                                     |
| -------- | ---------------- | ----------------------------------------------------------------------------- |
| `GET`    | `/processes`     | Lista paginada com filtros (`search`, `status`, `type`, `priority`, `areaId`) |
| `GET`    | `/processes/:id` | Detalhes completos (inclui pai, filhos, ferramentas, etc.)                    |
| `POST`   | `/processes`     | Cria processo com relações (body completo)                                    |
| `PUT`    | `/processes/:id` | Atualiza parcialmente (replace strategy para relações)                        |
| `DELETE` | `/processes/:id` | Remove processo (cascade nos filhos e relações)                               |

### Metadados

| Método | Rota                      | Descrição                      |
| ------ | ------------------------- | ------------------------------ |
| `GET`  | `/metadata/status-colors` | Cores e labels dos status      |
| `GET`  | `/metadata/process-types` | Ícones e cores dos tipos       |
| `GET`  | `/metadata/priorities`    | Cores e labels das prioridades |

---

## Como Rodar

### Pré-requisitos

- **Node.js** 18+
- **PostgreSQL** rodando (local ou cloud)
- **npm** ou **yarn**

### 1. Backend

```bash
cd backend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com: DATABASE_URL, PORT (3333), CORS_ORIGIN

# Executar migrações do Prisma
npx prisma migrate dev

# Iniciar em modo dev (hot reload)
npm run dev
```

### 2. Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
# Criar .env.local com: NEXT_PUBLIC_API_BASE_URL=http://localhost:3333

# Iniciar em modo dev
npm run dev
```

### 3. Acessar

| Recurso      | URL                            |
| ------------ | ------------------------------ |
| Frontend     | http://localhost:3000          |
| Backend API  | http://localhost:3333          |
| Swagger Docs | http://localhost:3333/api-docs |

---

## Testes

```bash
cd backend

# Rodar todos os testes (Vitest + Supertest)
npm test
```

Os testes cobrem:

- **Áreas**: criação, listagem, busca por ID, atualização e exclusão
- **Processos**: mesmos cenários + validações de hierarquia

---

## Stack Tecnológica

### Backend

| Tecnologia          | Uso                              |
| ------------------- | -------------------------------- |
| Express 5           | Framework HTTP                   |
| Prisma 6            | ORM + migrações                  |
| PostgreSQL          | Banco de dados relacional        |
| Zod 4               | Validação de schemas             |
| Swagger (OpenAPI 3) | Documentação interativa da API   |
| Vitest + Supertest  | Testes unitários e de integração |
| Morgan              | Logging de requisições HTTP      |
| TypeScript 5        | Tipagem estática                 |

### Frontend

| Tecnologia           | Uso                                   |
| -------------------- | ------------------------------------- |
| Next.js 16           | Framework React (App Router, SSR)     |
| React 19             | Biblioteca de UI                      |
| TanStack Query v5    | Cache, fetch e sincronização de dados |
| React Hook Form      | Gerenciamento de formulários          |
| Zod 4                | Validação client-side                 |
| React Flow           | Visualização de grafos interativos    |
| shadcn/ui + Radix UI | Componentes de interface acessíveis   |
| Tailwind CSS v4      | Estilização utility-first             |
| Axios                | Cliente HTTP                          |
| Sonner               | Notificações toast                    |
| Lucide React         | Ícones SVG                            |

---

## Licença

ISC
