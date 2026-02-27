import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Case Stage API",
      version: "1.0.0",
      description:
        "API para gerenciamento de áreas e processos organizacionais",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3333}`,
        description: "Servidor de desenvolvimento",
      },
    ],
    components: {
      schemas: {
        Area: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string", example: "Recursos Humanos" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Process: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            title: { type: "string", example: "Recrutamento" },
            description: { type: "string", nullable: true },
            type: { type: "string", enum: ["Sistemico", "Manual"] },
            status: {
              type: "string",
              enum: ["Planejado", "Em_Andamento", "Concluido", "Cancelado"],
            },
            priority: { type: "string", enum: ["Alta", "Media", "Baixa"] },
            startDate: { type: "string", format: "date-time", nullable: true },
            endDate: { type: "string", format: "date-time", nullable: true },
            areaId: { type: "string", format: "uuid" },
            parentId: { type: "string", format: "uuid", nullable: true },
            area: {
              type: "object",
              properties: {
                id: { type: "string", format: "uuid" },
                name: { type: "string" },
              },
            },
            tools: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string", format: "uuid" },
                  name: { type: "string" },
                },
              },
            },
            responsibles: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string", format: "uuid" },
                  name: { type: "string" },
                  role: { type: "string", nullable: true },
                },
              },
            },
            documents: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string", format: "uuid" },
                  title: { type: "string" },
                  url: { type: "string", nullable: true },
                },
              },
            },
            children: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string", format: "uuid" },
                  title: { type: "string" },
                  status: { type: "string" },
                  type: { type: "string" },
                },
              },
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        PaginatedAreas: {
          type: "object",
          properties: {
            data: {
              type: "array",
              items: { $ref: "#/components/schemas/Area" },
            },
            total: { type: "integer", example: 10 },
            page: { type: "integer", example: 1 },
            limit: { type: "integer", example: 20 },
            totalPages: { type: "integer", example: 1 },
          },
        },
        PaginatedProcesses: {
          type: "object",
          properties: {
            data: {
              type: "array",
              items: { $ref: "#/components/schemas/Process" },
            },
            total: { type: "integer", example: 10 },
            page: { type: "integer", example: 1 },
            limit: { type: "integer", example: 20 },
            totalPages: { type: "integer", example: 1 },
          },
        },
        Error: {
          type: "object",
          properties: {
            errors: {
              type: "object",
              properties: {
                default: { type: "string" },
              },
            },
          },
        },
      },
    },
    paths: {
      "/": {
        get: {
          tags: ["Health"],
          summary: "Health check",
          responses: {
            "200": {
              description: "API está rodando",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string", example: "ok" },
                      message: {
                        type: "string",
                        example: "API Case Stage rodando!",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/areas": {
        get: {
          tags: ["Áreas"],
          summary: "Listar todas as áreas",
          parameters: [
            {
              name: "page",
              in: "query",
              schema: { type: "integer", default: 1 },
              description: "Número da página",
            },
            {
              name: "limit",
              in: "query",
              schema: { type: "integer", default: 20 },
              description: "Itens por página",
            },
            {
              name: "filter",
              in: "query",
              schema: { type: "string" },
              description: "Filtro por nome",
            },
          ],
          responses: {
            "200": {
              description: "Lista paginada de áreas",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/PaginatedAreas" },
                },
              },
            },
          },
        },
        post: {
          tags: ["Áreas"],
          summary: "Criar uma nova área",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["name"],
                  properties: {
                    name: {
                      type: "string",
                      minLength: 3,
                      maxLength: 255,
                      example: "Recursos Humanos",
                    },
                  },
                },
              },
            },
          },
          responses: {
            "201": {
              description: "Área criada com sucesso",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Area" },
                },
              },
            },
            "409": {
              description: "Nome já existe",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
          },
        },
      },
      "/areas/{id}": {
        get: {
          tags: ["Áreas"],
          summary: "Buscar área por ID",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          responses: {
            "200": {
              description: "Área encontrada",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Area" },
                },
              },
            },
            "404": {
              description: "Área não encontrada",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
          },
        },
        put: {
          tags: ["Áreas"],
          summary: "Atualizar área",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    name: { type: "string", minLength: 3, maxLength: 255 },
                  },
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Área atualizada",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Area" },
                },
              },
            },
            "404": { description: "Área não encontrada" },
            "409": { description: "Nome já existe" },
          },
        },
        delete: {
          tags: ["Áreas"],
          summary: "Deletar área",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          responses: {
            "204": { description: "Área deletada com sucesso" },
            "404": { description: "Área não encontrada" },
          },
        },
      },
      "/processes": {
        get: {
          tags: ["Processos"],
          summary: "Listar todos os processos",
          parameters: [
            {
              name: "page",
              in: "query",
              schema: { type: "integer", default: 1 },
              description: "Número da página",
            },
            {
              name: "limit",
              in: "query",
              schema: { type: "integer", default: 20 },
              description: "Itens por página",
            },
            {
              name: "search",
              in: "query",
              schema: { type: "string" },
              description: "Busca por título ou descrição",
            },
            {
              name: "status",
              in: "query",
              schema: {
                type: "string",
                enum: ["Planejado", "Em_Andamento", "Concluido", "Cancelado"],
              },
            },
            {
              name: "type",
              in: "query",
              schema: { type: "string", enum: ["Sistemico", "Manual"] },
            },
            {
              name: "priority",
              in: "query",
              schema: { type: "string", enum: ["Alta", "Media", "Baixa"] },
            },
            {
              name: "areaId",
              in: "query",
              schema: { type: "string", format: "uuid" },
              description: "Filtrar por área",
            },
          ],
          responses: {
            "200": {
              description: "Lista paginada de processos",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/PaginatedProcesses" },
                },
              },
            },
          },
        },
        post: {
          tags: ["Processos"],
          summary: "Criar um novo processo",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["title", "areaId"],
                  properties: {
                    title: { type: "string", minLength: 3, maxLength: 255 },
                    description: { type: "string", nullable: true },
                    type: {
                      type: "string",
                      enum: ["Sistemico", "Manual"],
                      default: "Manual",
                    },
                    status: {
                      type: "string",
                      enum: [
                        "Planejado",
                        "Em_Andamento",
                        "Concluido",
                        "Cancelado",
                      ],
                      default: "Planejado",
                    },
                    priority: {
                      type: "string",
                      enum: ["Alta", "Media", "Baixa"],
                      default: "Media",
                    },
                    startDate: {
                      type: "string",
                      format: "date-time",
                      nullable: true,
                    },
                    endDate: {
                      type: "string",
                      format: "date-time",
                      nullable: true,
                    },
                    areaId: { type: "string", format: "uuid" },
                    parentId: {
                      type: "string",
                      format: "uuid",
                      nullable: true,
                    },
                    tools: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: { name: { type: "string" } },
                      },
                    },
                    responsibles: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          name: { type: "string" },
                          role: { type: "string", nullable: true },
                        },
                      },
                    },
                    documents: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          title: { type: "string" },
                          url: { type: "string", nullable: true },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          responses: {
            "201": {
              description: "Processo criado",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Process" },
                },
              },
            },
            "404": { description: "Área não encontrada" },
            "400": { description: "Dados inválidos" },
          },
        },
      },
      "/processes/{id}": {
        get: {
          tags: ["Processos"],
          summary: "Buscar processo por ID",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          responses: {
            "200": {
              description: "Processo encontrado",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Process" },
                },
              },
            },
            "404": { description: "Processo não encontrado" },
          },
        },
        put: {
          tags: ["Processos"],
          summary: "Atualizar processo",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    title: { type: "string", minLength: 3, maxLength: 255 },
                    description: { type: "string", nullable: true },
                    type: { type: "string", enum: ["Sistemico", "Manual"] },
                    status: {
                      type: "string",
                      enum: [
                        "Planejado",
                        "Em_Andamento",
                        "Concluido",
                        "Cancelado",
                      ],
                    },
                    priority: {
                      type: "string",
                      enum: ["Alta", "Media", "Baixa"],
                    },
                    startDate: {
                      type: "string",
                      format: "date-time",
                      nullable: true,
                    },
                    endDate: {
                      type: "string",
                      format: "date-time",
                      nullable: true,
                    },
                    areaId: { type: "string", format: "uuid" },
                    parentId: {
                      type: "string",
                      format: "uuid",
                      nullable: true,
                    },
                    tools: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: { name: { type: "string" } },
                      },
                    },
                    responsibles: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          name: { type: "string" },
                          role: { type: "string", nullable: true },
                        },
                      },
                    },
                    documents: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          title: { type: "string" },
                          url: { type: "string", nullable: true },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Processo atualizado",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Process" },
                },
              },
            },
            "404": { description: "Processo ou área não encontrado" },
            "400": { description: "Dados inválidos" },
          },
        },
        delete: {
          tags: ["Processos"],
          summary: "Deletar processo",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          responses: {
            "204": { description: "Processo deletado com sucesso" },
            "404": { description: "Processo não encontrado" },
          },
        },
      },
      "/metadata/status-colors": {
        get: {
          tags: ["Metadata"],
          summary: "Cores dos status de processos",
          responses: {
            "200": { description: "Mapeamento de cores por status" },
          },
        },
      },
      "/metadata/process-types": {
        get: {
          tags: ["Metadata"],
          summary: "Tipos de processos com ícones",
          responses: {
            "200": { description: "Mapeamento de ícones por tipo" },
          },
        },
      },
      "/metadata/priorities": {
        get: {
          tags: ["Metadata"],
          summary: "Cores das prioridades",
          responses: {
            "200": { description: "Mapeamento de cores por prioridade" },
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);
