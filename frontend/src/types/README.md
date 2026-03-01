# Types

Definições TypeScript centralizadas para toda a aplicação frontend.

## Arquivos

| Arquivo      | Conteúdo                                                          |
| ------------ | ----------------------------------------------------------------- |
| `area.ts`    | `IArea`, `IAreaFormData`                                          |
| `process.ts` | Enums, `IProcess*`, `ITool`, `IResponsible`, `IDocument`, inputs  |
| `api.ts`     | `IPaginatedResult<T>`, `IApiErrorResponse`, `IApiValidationError` |
| `index.ts`   | Barrel export (re-exporta tudo)                                   |

## Enums de Processo

```ts
ProcessStatus: "Planejado" | "Em_Andamento" | "Concluido" | "Cancelado";
ProcessPriority: "Alta" | "Media" | "Baixa";
ProcessType: "Sistemico" | "Manual";
```

## Interfaces principais

| Interface               | Descrição                                  |
| ----------------------- | ------------------------------------------ |
| `IArea`                 | Área retornada pela API                    |
| `IProcessWithRelations` | Processo com todas as relações (listagem)  |
| `IProcessDetails`       | Processo detalhado (inclui `parent`)       |
| `IProcessTreeNode`      | Nó recursivo da árvore hierárquica         |
| `ICreateProcessInput`   | Dados para criação de processo             |
| `IUpdateProcessInput`   | Dados para atualização parcial de processo |
| `IPaginatedResult<T>`   | Envelope de resposta paginada genérico     |
| `IApiErrorResponse`     | Formato padronizado de erro da API         |

## Convenção

- Interfaces começam com `I` (ex: `IArea`)
- Enums usam `const arrays` + type inference para garantir compatibilidade com Zod
- Inputs de criação/atualização são DTOs separados das interfaces de resposta
