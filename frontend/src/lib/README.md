# Lib

Utilitários e configurações compartilhados por toda a aplicação frontend.

## Arquivos

| Arquivo               | Responsabilidade                                           |
| --------------------- | ---------------------------------------------------------- |
| `axios.ts`            | Instância Axios pré-configurada + `extractApiError()`      |
| `queryKeys.ts`        | Fábrica hierárquica de query keys (TanStack Query)         |
| `statusConfig.ts`     | Mapas de cor/ícone/label para Status, Prioridade e Tipo    |
| `dashboardService.ts` | Serviço HTTP para endpoints `/dashboard/*`                 |
| `metadataService.ts`  | Serviço HTTP para endpoints `/metadata/*`                  |
| `utils.ts`            | Utilitário `cn()` para classes CSS (clsx + tailwind-merge) |

## `axios.ts`

```ts
// Instância configurada com baseURL da API
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3333",
});

// Normaliza 3 formatos de erro da API em uma string legível
export function extractApiError(error: unknown): string { ... }
```

## `queryKeys.ts`

Centraliza todas as chaves de cache para evitar strings hardcoded. Exemplo:

```ts
queryKeys.areas.list(1, 20); // ["areas", "list", { page: 1, limit: 20 }]
queryKeys.processes.detail("uuid"); // ["processes", "detail", "uuid"]
queryKeys.dashboard.byStatus(); // ["dashboard", "by-status", { areaId: undefined }]
```

## `statusConfig.ts`

Exporta mapas tipados com configurações visuais:

- `STATUS_CONFIG` — cor, ícone e label para cada `ProcessStatus`
- `PRIORITY_CONFIG` — cor, ícone e label para cada `ProcessPriority`
- `TYPE_CONFIG` — cor, ícone e label para cada `ProcessType`

Utilizado pelos componentes `StatusBadge`, `PriorityBadge` e `TypeBadge`.
