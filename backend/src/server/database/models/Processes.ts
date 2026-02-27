export const PROCESS_STATUS_VALUES = ["Planejado", "Em_Andamento", "Concluido", "Cancelado"] as const;
export type ProcessStatus = (typeof PROCESS_STATUS_VALUES)[number];

export const PROCESS_PRIORITY_VALUES = ["Alta", "Media", "Baixa"] as const;
export type ProcessPriority = (typeof PROCESS_PRIORITY_VALUES)[number];

export const PROCESS_TYPE_VALUES = ["Sistemico", "Manual"] as const;
export type ProcessType = (typeof PROCESS_TYPE_VALUES)[number];

export interface IProcess {
  id: string;
  title: string;
  description?: string | null;
  type: ProcessType;
  status: ProcessStatus;
  priority: ProcessPriority;
  startDate?: Date | null;
  endDate?: Date | null;
  areaId: string;
  parentId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITool {
  id: string;
  name: string;
  processId: string;
}

export interface IResponsible {
  id: string;
  name: string;
  role?: string | null;
  processId: string;
}

export interface IDocument {
  id: string;
  title: string;
  url?: string | null;
  processId: string;
}
