# Repositories

Camada de **acesso direto ao banco de dados** via Prisma. Cada repositório encapsula queries específicas para uma entidade.

## Estrutura

```
repositories/
├── areas/
│   ├── IAreasRepository.ts   → Interface/contrato do repositório
│   ├── index.ts               → Barrel export + composição do objeto
│   ├── Create.ts              → prisma.area.create()
│   ├── GetAll.ts              → Listagem paginada com filtro
│   ├── GetByID.ts             → findUnique + findFirst (getByName)
│   ├── UpdateByID.ts          → prisma.area.update()
│   └── DeleteByID.ts          → prisma.area.delete()
└── processes/
    ├── IProcessesRepository.ts → Interface + tipos derivados
    ├── index.ts                → Barrel export + composição
    ├── Create.ts               → Cria processo com relações (nested create)
    ├── GetAll.ts               → Listagem paginada com filtros múltiplos
    ├── GetByID.ts              → findUnique com includes completos
    ├── GetTree.ts              → Busca flat de processos por área (para montar árvore)
    ├── UpdateByID.ts           → Atualização com replace de relações ($transaction)
    └── DeleteByID.ts           → prisma.process.delete() (cascade)
```

## Padrão de retorno

Todos os métodos seguem a convenção:

- **Sucesso** → retorna o dado (entidade, lista paginada, `void`)
- **Falha** → retorna `new Error("mensagem")`

O Service responsável trata o retorno e lança `AppError` quando necessário.

## Tipos importantes (`IProcessesRepository.ts`)

| Tipo                    | Uso                                          |
| ----------------------- | -------------------------------------------- |
| `IProcessWithRelations` | Processo com area, tools, responsibles, etc. |
| `IProcessDetails`       | Igual acima + parent + children com priority |
| `IProcessTreeNode`      | Nó da árvore hierárquica (recursivo)         |
| `IPaginatedResult<T>`   | Envelope genérico de paginação               |
| `ICreateProcessData`    | Dados de criação (inclui nested arrays)      |
| `IUpdateProcessData`    | Dados de atualização (todos opcionais)       |

## Estratégia de update (Processos)

Relações são atualizadas com **replace strategy**:

1. Deleta todos os registros filhos existentes (`tools`, `responsibles`, `documents`)
2. Recria com os novos dados enviados
3. Tudo dentro de uma `$transaction` para atomicidade
