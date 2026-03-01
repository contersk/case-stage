# Controllers

Camada responsável por **receber requisições HTTP**, **validar entrada** (via Zod) e **delegar ao Service** correspondente.

## Estrutura

```
controllers/
├── index.ts              → Re-exporta AreasController e ProcessesController
├── areas/
│   ├── index.ts           → Barrel export do AreasController
│   ├── Create.ts          → POST   /areas
│   ├── GetAll.ts          → GET    /areas
│   ├── GetByID.ts         → GET    /areas/:id
│   ├── UpdateByID.ts      → PUT    /areas/:id
│   └── DeleteByID.ts      → DELETE /areas/:id
└── processes/
    ├── index.ts           → Barrel export do ProcessesController
    ├── Create.ts          → POST   /processes
    ├── GetAll.ts          → GET    /processes
    ├── GetByID.ts         → GET    /processes/:id
    ├── GetTree.ts         → GET    /areas/:id/tree
    ├── UpdateByID.ts      → PUT    /processes/:id
    └── DeleteByID.ts      → DELETE /processes/:id
```

## Padrão de cada Controller

Cada arquivo exporta **dois artefatos**:

1. **`*Validation`** — middleware de validação Zod (body, params, query)
2. **Handler `async`** — função `(req, res, next)` que chama o Service e responde com o status correto

```ts
// Exemplo simplificado
export const createValidation = validation((getSchema) => ({
  body: getSchema<IBodyProps>(zodSchema),
}));

export const Create = async (req, res, next) => {
  const result = await Service.create(req.body);
  res.status(201).json(result);
};
```

## Fluxo de uma Requisição

```
Cliente → Router → Validation Middleware → Controller Handler → Service → Repository → Prisma → PostgreSQL
```

Erros lançados no Service/Repository são interceptados pelo `errorHandler` global (veja `shared/middleware/`).
