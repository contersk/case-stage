/**
 * @file Serviço HTTP para o domínio de Processos.
 *
 * Encapsula as chamadas REST para `/processes` e `/areas/:id/tree`.
 * Usado pelos hooks `useProcesses`, `useCreateProcess`, etc.
 *
 * @module features/processes/service
 */
import { api } from "@/lib/axios";
import type {
  IProcessWithRelations,
  IProcessDetails,
  IProcessTreeNode,
  ICreateProcessInput,
  IUpdateProcessInput,
  IPaginatedResult,
} from "@/types";

/** Filtros disponíveis para listagem de processos. Todos opcionais. */
export interface IProcessFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  type?: string;
  priority?: string;
  areaId?: string;
}

/**
 * Camada de serviço HTTP para Processos.
 * Encapsula chamadas Axios para /processes e /areas/:id/tree.
 * Utilizado pelos hooks do TanStack Query em features/processes/hooks.ts.
 */
export const processesService = {
  getAll: async (filters: IProcessFilters = {}) => {
    const { page = 1, limit = 20, ...rest } = filters;
    const params: Record<string, string | number> = { page, limit };
    Object.entries(rest).forEach(([k, v]) => {
      if (v) params[k] = v;
    });
    const { data } = await api.get<IPaginatedResult<IProcessWithRelations>>(
      "/processes",
      { params },
    );
    return data;
  },

  getById: async (id: string) => {
    const { data } = await api.get<IProcessDetails>(`/processes/${id}`);
    return data;
  },

  getTree: async (areaId: string) => {
    const { data } = await api.get<IProcessTreeNode[]>(`/areas/${areaId}/tree`);
    return data;
  },

  create: async (body: ICreateProcessInput) => {
    const { data } = await api.post<IProcessDetails>("/processes", body);
    return data;
  },

  update: async (id: string, body: IUpdateProcessInput) => {
    const { data } = await api.put<IProcessDetails>(`/processes/${id}`, body);
    return data;
  },

  delete: async (id: string) => {
    await api.delete(`/processes/${id}`);
  },
};
