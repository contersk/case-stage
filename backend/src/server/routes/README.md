# Routes

Arquivo centralizado com todas as rotas da API.

## Organização

| Grupo         | Endpoint                  | Método | Descrição                                |
| ------------- | ------------------------- | ------ | ---------------------------------------- |
| **Health**    | `/`                       | GET    | Health check (status da API)             |
| **Áreas**     | `/areas`                  | GET    | Listar áreas (paginado, filtro por nome) |
|               | `/areas`                  | POST   | Criar nova área                          |
|               | `/areas/:id`              | GET    | Buscar área por ID                       |
|               | `/areas/:id`              | PUT    | Atualizar área                           |
|               | `/areas/:id`              | DELETE | Excluir área (cascade)                   |
|               | `/areas/:id/tree`         | GET    | Árvore hierárquica de processos da área  |
| **Processos** | `/processes`              | GET    | Listar processos (paginado, filtros)     |
|               | `/processes`              | POST   | Criar novo processo                      |
|               | `/processes/:id`          | GET    | Buscar processo por ID                   |
|               | `/processes/:id`          | PUT    | Atualizar processo                       |
|               | `/processes/:id`          | DELETE | Excluir processo (cascade)               |
| **Dashboard** | `/dashboard/by-status`    | GET    | Processos agrupados por status           |
|               | `/dashboard/by-area`      | GET    | Contagem de processos por área           |
|               | `/dashboard/by-priority`  | GET    | Processos agrupados por prioridade       |
|               | `/dashboard/by-type`      | GET    | Processos agrupados por tipo             |
| **Metadata**  | `/metadata/status-colors` | GET    | Cores e labels dos status                |
|               | `/metadata/process-types` | GET    | Cores e labels dos tipos                 |
|               | `/metadata/priorities`    | GET    | Cores e labels das prioridades           |

## Filtros do Dashboard

Os endpoints `/dashboard/by-status`, `/dashboard/by-priority` e `/dashboard/by-type` aceitam o query param `?areaId=` para filtrar por área específica.

## Documentação Swagger

A documentação interativa está disponível em `/api-docs` (Swagger UI), alimentada pelo arquivo `swaggerConfig.ts`.
