# Database

Camada de **acesso a dados** e **modelos de domínio**. Contém o cliente Prisma, interfaces TypeScript e os serviços de negócio.

## Estrutura

```
database/
├── index.ts       → Barrel export (prisma, models, services)
├── prisma.ts      → Singleton do PrismaClient
├── models/        → Interfaces TypeScript (IArea, IProcess, ITool, etc.)
├── services/      → Regras de negócio (validações, orquestração)
└── prisma/        → Schema Prisma + migrações SQL
```

## Prisma Client

O arquivo `prisma.ts` exporta uma instância singleton do `PrismaClient`, reutilizada em toda a aplicação.

## Models

Definem os tipos TypeScript que representam as entidades do banco:

| Arquivo        | Tipos exportados                                        |
| -------------- | ------------------------------------------------------- |
| `Area.ts`      | `IArea`                                                 |
| `Processes.ts` | `IProcess`, `ITool`, `IResponsible`, `IDocument`, enums |

### Enums

| Enum              | Valores                                               |
| ----------------- | ----------------------------------------------------- |
| `ProcessStatus`   | `Planejado`, `Em_Andamento`, `Concluido`, `Cancelado` |
| `ProcessPriority` | `Alta`, `Media`, `Baixa`                              |
| `ProcessType`     | `Sistemico`, `Manual`                                 |

## Services

Localizado em `services/`, contém a lógica de negócio da aplicação:

### AreasService

- Valida unicidade do nome antes de criar/atualizar
- Verifica existência antes de get/update/delete
- Lança `ConflictError` (409) ou `NotFoundError` (404)

### ProcessesService

- Valida existência da Área vinculada
- Impede auto-referência (processo pai de si mesmo)
- Garante que pai e filho pertencem à mesma Área
- Valida coerência de datas (`startDate ≤ endDate`)
- Monta árvore hierárquica para o endpoint `/areas/:id/tree`

## Schema Prisma

Localizado em `prisma/schema.prisma`. Inclui:

- **5 models**: `Area`, `Process`, `Tool`, `Responsible`, `Document`
- **3 enums**: `process_priority`, `process_type`, `process_status`
- **Gerador de docs**: `prisma-docs-generator` (output em `docs/database/`)
- **Cascata**: todas as relações usam `onDelete: Cascade`

Para gerar a documentação do banco:

```bash
npm run prisma:docs
```
