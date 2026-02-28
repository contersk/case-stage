import { api } from "@/lib/axios";
import type { IArea, IAreaFormData, IPaginatedResult } from "@/types";

/**
 * Camada de serviço HTTP para Áreas.
 * Encapsula todas as chamadas Axios para o domínio /areas da API.
 * Utilizado pelos hooks do TanStack Query em features/areas/hooks.ts.
 */
export const areasService = {
  getAll: async (page = 1, limit = 20, filter?: string) => {
    const params: Record<string, string | number> = { page, limit };
    if (filter) params.filter = filter;
    const { data } = await api.get<IPaginatedResult<IArea>>("/areas", {
      params,
    });
    return data;
  },

  getById: async (id: string) => {
    const { data } = await api.get<IArea>(`/areas/${id}`);
    return data;
  },

  create: async (body: IAreaFormData) => {
    const { data } = await api.post<IArea>("/areas", body);
    return data;
  },

  update: async (id: string, body: Partial<IAreaFormData>) => {
    const { data } = await api.put<IArea>(`/areas/${id}`, body);
    return data;
  },

  delete: async (id: string) => {
    await api.delete(`/areas/${id}`);
  },
};
