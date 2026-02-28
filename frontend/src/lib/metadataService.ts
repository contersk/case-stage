import { api } from "@/lib/axios";

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
