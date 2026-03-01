/**
 * @file Serviço HTTP para endpoints de Metadados.
 *
 * Fornece configurações estáticas da API (cores de status,
 * tipos de processo, prioridades) que são cacheadas com
 * `staleTime: Infinity` nos hooks.
 *
 * @module lib/metadataService
 */
import { api } from "@/lib/axios";

/** Configuração de cor e label de um status. */
export interface IStatusColorMeta {
  color: string;
  label: string;
  description: string;
}

export interface IProcessTypeMeta {
  icon: string;
  label: string;
  description: string;
  color: string;
}

export interface IPriorityMeta {
  color: string;
  label: string;
  description: string;
}

export const metadataService = {
  getStatusColors: async () => {
    const { data } = await api.get<Record<string, IStatusColorMeta>>(
      "/metadata/status-colors",
    );
    return data;
  },

  getProcessTypes: async () => {
    const { data } = await api.get<Record<string, IProcessTypeMeta>>(
      "/metadata/process-types",
    );
    return data;
  },

  getPriorities: async () => {
    const { data } = await api.get<Record<string, IPriorityMeta>>(
      "/metadata/priorities",
    );
    return data;
  },
};
