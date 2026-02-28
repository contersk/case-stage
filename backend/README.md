# Case Stage — Backend

API REST para gerenciamento de áreas organizacionais e processos hierárquicos.

---

## Stack

- **Express 5** — Framework HTTP
- **Prisma 6** — ORM para PostgreSQL
- **Zod 4** — Validação de schemas de request
- **Swagger** — Documentação OpenAPI 3.0 em `/api-docs`
- **Vitest + Supertest** — Testes automatizados
- **TypeScript 5** — Tipagem estática

---

## Arquitetura em Camadas

```
src/
├── index.ts                          # Entry point — inicia o servidor HTTP
└── server/
    ├── Server.ts                     # Configuração do Express (CORS, JSON, Morgan, Swagger, error handler)
    ├── swaggerConfig.ts              # Definição OpenAPI 3.0 dos schemas e endpoints
    ├── routes/index.ts               # Mapeamento de rotas → controllers
    ├── controllers/                  # Camada de entrada: validação Zod + handler HTTP
    │   ├── areas/                    # Create, GetAll, GetByID, UpdateByID, DeleteByID
    │   └── processes/                # Create, GetAll, GetByID, GetTree, UpdateByID, DeleteByID
    ├── database/
    │   ├── models/                   # Interfaces TypeScript (IArea, IProcess, ITool, etc.)
    │   ├── prisma/                   # Schema Prisma + migrações
    │   ├── prisma.ts                 # Instância singleton do PrismaClient
    │   └── services/                 # Regras de negócio e validações
    │       ├── areas/AreasServices.ts
    │       └── processes/ProcessesServices.ts
    ├── repositories/                 # Acesso direto ao banco (queries Prisma)
    │   ├── areas/                    # CRUD de áreas
    │   └── processes/                # CRUD + GetTree de processos
    └── shared/
        ├── middleware/
        │   ├── validation.ts         # Middleware genérico de validação Zod
        │   └── errorHandler.ts       # Tratamento global de erros
        └── utils/
            └── CustomErrors.ts       # AppError, NotFoundError, BadRequestError, ConflictError
```

---

## Fluxo de uma Requisição

```
Request → Route → Validation Middleware (Zod) → Controller → Service → Repository → Prisma → PostgreSQL
                                                                                           ↓
Response ← Controller ← Service ← Repository ← Prisma ←──────────────────────────────────┘
     ↑
     └── Error Handler (erros Zod → 400, AppError → status customizado, genéricos → 500)
```

---

## Regras de Negócio (Services)

### AreasService

- **Criação**: valida que o nome é único (→ `ConflictError 409` se duplicado).
- **Atualização**: valida existência da área + unicidade do novo nome.
- **Exclusão**: valida existência antes de remover (cascade automático no banco).

### ProcessesService

- **Criação**: valida que a área existe, o processo pai existe (se informado), a área do filho coincide com a do pai, não permite auto-referência, e valida range de datas.
- **Atualização parcial**: mescla dados enviados com os existentes antes de re-validar todas as regras.
- **Árvore (`getTree`)**: busca todos os processos de uma área e constrói a árvore recursiva em memória via `buildTree()`.
- **Relações (tools/responsibles/documents)**: usa _replace strategy_ — em updates, deleta e recria dentro de uma transação Prisma.

---

## Variáveis de Ambiente

| Variável       | Descrição                                      | Padrão |
| -------------- | ---------------------------------------------- | ------ |
| `DATABASE_URL` | String de conexão PostgreSQL                   | —      |
| `PORT`         | Porta do servidor HTTP                         | `3333` |
| `CORS_ORIGIN`  | Origens CORS permitidas (separadas por `,`)    | `*`    |
| `NODE_ENV`     | Ambiente (`development`, `test`, `production`) | —      |

---

## Scripts

| Comando       | Descrição                           |
| ------------- | ----------------------------------- |
| `npm run dev` | Inicia com hot reload (`tsx watch`) |
| `npm start`   | Inicia em produção (`tsx`)          |
| `npm test`    | Roda testes com Vitest              |

---

## Erros Customizados

| Classe            | HTTP Status | Uso                                                       |
| ----------------- | ----------- | --------------------------------------------------------- |
| `AppError`        | Variável    | Erro base da aplicação                                    |
| `NotFoundError`   | 404         | Recurso não encontrado                                    |
| `BadRequestError` | 400         | Dados inválidos / regra violada                           |
| `ConflictError`   | 409         | Conflito de dados (nome duplicado, auto-referência, etc.) |
