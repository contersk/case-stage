# Shared

Utilitários e middlewares compartilhados por toda a aplicação backend.

## Estrutura

```
shared/
├── middleware/
│   ├── index.ts           → Re-exporta validation + errorHandler
│   ├── validation.ts      → Middleware genérico de validação Zod
│   └── errorHandler.ts    → Middleware global de tratamento de erros
└── utils/
    ├── index.ts           → Re-exporta CustomErrors
    └── CustomErrors.ts    → Classes de erro HTTP customizadas
```

## Middleware de Validação (`validation.ts`)

Cria middlewares reutilizáveis que validam `body`, `params`, `query` e `header` contra schemas Zod.

```ts
// Uso no controller
export const createValidation = validation((getSchema) => ({
  body: getSchema<IBodyProps>(bodySchema),
  params: getSchema<IParamProps>(paramSchema),
}));
```

Erros de validação retornam **400 Bad Request** com o formato:

```json
{
  "errors": {
    "body": { "name": "O nome deve ter no mínimo 3 caracteres." },
    "params": { "id": "O parâmetro 'id' deve ser um UUID válido." }
  }
}
```

## Error Handler (`errorHandler.ts`)

Middleware registrado como **último middleware** (depois das rotas). Intercepta todos os erros e responde com JSON padronizado:

| Tipo de erro      | Status | Formato de resposta                          |
| ----------------- | ------ | -------------------------------------------- |
| Zod (issues)      | 400    | `{ errors: { validation: [...] } }`          |
| `AppError`        | custom | `{ errors: { default: "mensagem" } }`        |
| Erro desconhecido | 500    | `{ errors: { default: "Erro interno..." } }` |

## Custom Errors (`CustomErrors.ts`)

| Classe            | HTTP Status | Quando usar                                       |
| ----------------- | ----------- | ------------------------------------------------- |
| `AppError`        | customizado | Classe base — não usar diretamente                |
| `NotFoundError`   | 404         | Recurso não encontrado no banco                   |
| `BadRequestError` | 400         | Dados inválidos (ex: dateRange inconsistente)     |
| `ConflictError`   | 409         | Violação de regra de negócio (ex: nome duplicado) |
