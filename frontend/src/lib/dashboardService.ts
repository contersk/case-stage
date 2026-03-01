/**
 * @file Serviço HTTP para os endpoints de Dashboard.
 *
 * Consome os endpoints `/dashboard/by-status`, `/dashboard/by-area`,
 * `/dashboard/by-priority` e `/dashboard/by-type` para alimentar
 * os gráficos e cards do painel principal.
 *
 * @module lib/dashboardService
 */
import { api } from "@/lib/axios";

/** Estatísticas agrupadas por status de processo. */
export interface IStatByStatus {
  status: string;
  count: number;
}

export interface IStatByArea {
  id: string;
  name: string;
  processCount: number;
}

export interface IStatByPriority {
  priority: string;
  count: number;
}

export interface IStatByType {
  type: string;
  count: number;
}

export const dashboardService = {
  getByStatus: async (areaId?: string) => {
    const params = areaId ? { areaId } : {};
    const { data } = await api.get<IStatByStatus[]>("/dashboard/by-status", {
      params,
    });
    return data;
  },

  getByArea: async () => {
    const { data } = await api.get<IStatByArea[]>("/dashboard/by-area");
    return data;
  },

  getByPriority: async (areaId?: string) => {
    const params = areaId ? { areaId } : {};
    const { data } = await api.get<IStatByPriority[]>(
      "/dashboard/by-priority",
      { params },
    );
    return data;
  },

  getByType: async (areaId?: string) => {
    const params = areaId ? { areaId } : {};
    const { data } = await api.get<IStatByType[]>("/dashboard/by-type", {
      params,
    });
    return data;
  },
};
