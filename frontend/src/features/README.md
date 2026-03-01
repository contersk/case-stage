# Features

Módulos de domínio seguindo o padrão **Feature-Sliced Design**. Cada feature encapsula tudo que é necessário para uma entidade de negócio.

## Estrutura

```
features/
├── areas/
│   ├── service.ts    → Chamadas HTTP (Axios) para /areas
│   ├── hooks.ts      → React Query hooks (useAreas, useCreateArea, etc.)
│   └── index.ts      → Barrel export público
└── processes/
    ├── service.ts    → Chamadas HTTP para /processes e /areas/:id/tree
    ├── hooks.ts      → React Query hooks (useProcesses, useProcessTree, etc.)
    ├── index.ts      → Barrel export público
    └── components/   → Componentes exclusivos do domínio de processos
```

## Padrão de um módulo Feature

### Service (`service.ts`)

Encapsula chamadas HTTP usando a instância Axios de `lib/axios.ts`. Cada método corresponde a um endpoint da API.

```ts
export const areasService = {
  getAll: (page, limit, filter?) => api.get("/areas", { params }),
  create: (body) => api.post("/areas", body),
  // ...
};
```

### Hooks (`hooks.ts`)

Wrappers do TanStack Query que:

1. Usam `queryKeys` centralizadas para cache
2. Invalidam queries relacionadas após mutações
3. Exibem toasts de sucesso/erro automaticamente

```ts
export function useCreateArea() {
  return useMutation({
    mutationFn: areasService.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.areas.all });
      toast.success("Área criada com sucesso!");
    },
  });
}
```

## Componentes de Processo

| Componente                 | Descrição                                               |
| -------------------------- | ------------------------------------------------------- |
| `process-form.tsx`         | Formulário reutilizável (criar/editar) com field arrays |
| `process-tree-flow.tsx`    | Grafo interativo (React Flow) da árvore de processos    |
| `process-node.tsx`         | Nó customizado do grafo com status, tipo e contadores   |
| `process-detail-sheet.tsx` | Painel lateral com detalhes completos de um processo    |

## Como adicionar uma nova Feature

1. Crie uma pasta em `features/` com o nome do domínio
2. Crie `service.ts` com as chamadas HTTP
3. Crie `hooks.ts` com os hooks de Query/Mutation
4. Crie `index.ts` re-exportando tudo
5. Adicione query keys em `lib/queryKeys.ts`
