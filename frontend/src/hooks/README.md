# Hooks

React hooks globais reutilizáveis. Diferente dos hooks das features (que são específicos de domínio), estes hooks são genéricos e usados por múltiplas partes da aplicação.

## Arquivos

| Hook              | Descrição                                                |
| ----------------- | -------------------------------------------------------- |
| `useDashboard.ts` | Hooks de estatísticas agregadas para o painel            |
| `useMetadata.ts`  | Hooks de metadados estáticos (cores, tipos, prioridades) |
| `use-mobile.ts`   | Detecção de viewport mobile (para responsividade)        |

## `useDashboard.ts`

Consome o `dashboardService` e permite filtro por área:

```ts
const { data } = useStatsByStatus(areaId); // processos agrupados por status
const { data } = useStatsByArea(); // contagem por área
const { data } = useStatsByPriority(areaId); // agrupados por prioridade
const { data } = useStatsByType(areaId); // agrupados por tipo
```

## `useMetadata.ts`

Dados estáticos cacheados com `staleTime: Infinity` (nunca refetch):

```ts
const { data } = useStatusColors(); // cores e labels de status
const { data } = useProcessTypes(); // ícones e labels de tipo
const { data } = usePriorities(); // cores e labels de prioridade
```

## Diferença entre Hooks globais e Hooks de Feature

| Local                         | Escopo                           | Exemplo              |
| ----------------------------- | -------------------------------- | -------------------- |
| `hooks/`                      | Global, usado em qualquer página | `useStatsByStatus()` |
| `features/areas/hooks.ts`     | Específico do domínio de Áreas   | `useCreateArea()`    |
| `features/processes/hooks.ts` | Específico de Processos          | `useProcessTree()`   |
