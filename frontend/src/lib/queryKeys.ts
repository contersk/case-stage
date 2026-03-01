/**
 * Factory de query keys para o TanStack Query.
 * Garante consistência e previsibilidade na invalidação de cache.
 *
 * Padrão hierárquico: [entity, scope, ...params]
 * - Invalidar queryKeys.areas.all invalida TODAS as queries de áreas
 * - Invalidar queryKeys.processes.detail(id) invalida só o detalhe específico
 */
/**
 * @file Fábrica hierárquica de query keys para TanStack Query.
 *
 * Centraliza todas as chaves de cache usadas pela aplicação.
 * Seguir o padrão de `queryKeys.domain.action(params)` garante
 * invalidação granular sem acoplar componentes.
 *
 * @example
 * ```ts
 * queryKeys.areas.list(1, 20)       // ["areas", "list", { page: 1, limit: 20 }]
 * queryKeys.processes.detail("uuid") // ["processes", "detail", "uuid"]
 * ```
 *
 * @module lib/queryKeys
 */
export const queryKeys = {
  areas: {
    all: ["areas"] as const,
    list: (page: number, limit: number, filter?: string) =>
      ["areas", "list", { page, limit, filter }] as const,
    detail: (id: string) => ["areas", "detail", id] as const,
    tree: (areaId: string) => ["areas", "tree", areaId] as const,
  },

  processes: {
    all: ["processes"] as const,
    list: (params: object) => ["processes", "list", params] as const,
    detail: (id: string) => ["processes", "detail", id] as const,
  },

  metadata: {
    statusColors: ["metadata", "status-colors"] as const,
    processTypes: ["metadata", "process-types"] as const,
    priorities: ["metadata", "priorities"] as const,
  },

  dashboard: {
    all: ["dashboard"] as const,
    byStatus: (areaId?: string) =>
      ["dashboard", "by-status", { areaId }] as const,
    byArea: ["dashboard", "by-area"] as const,
    byPriority: (areaId?: string) =>
      ["dashboard", "by-priority", { areaId }] as const,
    byType: (areaId?: string) => ["dashboard", "by-type", { areaId }] as const,
  },
} as const;
