export const PROCESS_STATUS_VALUES = [
  "Planejado",
  "Em_Andamento",
  "Concluido",
  "Cancelado",
] as const;
export type ProcessStatus = (typeof PROCESS_STATUS_VALUES)[number];

export const PROCESS_PRIORITY_VALUES = ["Alta", "Media", "Baixa"] as const;
export type ProcessPriority = (typeof PROCESS_PRIORITY_VALUES)[number];

export const PROCESS_TYPE_VALUES = ["Sistemico", "Manual"] as const;
export type ProcessType = (typeof PROCESS_TYPE_VALUES)[number];

export interface ITool {
  id: string;
  name: string;
}

export interface IResponsible {
  id: string;
  name: string;
  role: string | null;
}

export interface IDocument {
  id: string;
  title: string;
  url: string | null;
}

export interface IProcessChild {
  id: string;
  title: string;
  status: string;
  type: string;
  priority?: string;
}

/** Shape retornado pelo GET /processes (listagem paginada) */
export interface IProcessWithRelations {
  id: string;
  title: string;
  description: string | null;
  type: ProcessType;
  status: ProcessStatus;
  priority: ProcessPriority;
  startDate: string | null;
  endDate: string | null;
  areaId: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
  area: { id: string; name: string };
  tools: ITool[];
  responsibles: IResponsible[];
  documents: IDocument[];
  children: IProcessChild[];
}

/** Shape retornado pelo GET /processes/:id */
export interface IProcessDetails extends IProcessWithRelations {
  parent?: { id: string; title: string } | null;
}

/** Shape de cada nó na árvore retornada pelo GET /areas/:id/tree */
export interface IProcessTreeNode {
  id: string;
  title: string;
  description: string | null;
  type: string;
  status: string;
  priority: string;
  parentId: string | null;
  areaId: string;
  tools: ITool[];
  responsibles: IResponsible[];
  documents: IDocument[];
  children: IProcessTreeNode[];
}

/** Payload para criação de processo */
export interface ICreateProcessInput {
  title: string;
  description?: string | null;
  type?: ProcessType;
  status?: ProcessStatus;
  priority?: ProcessPriority;
  startDate?: string | null;
  endDate?: string | null;
  areaId: string;
  parentId?: string | null;
  tools?: Array<{ name: string }>;
  responsibles?: Array<{ name: string; role?: string | null }>;
  documents?: Array<{ title: string; url?: string | null }>;
}

/** Payload para atualização de processo */
export interface IUpdateProcessInput {
  title?: string;
  description?: string | null;
  type?: ProcessType;
  status?: ProcessStatus;
  priority?: ProcessPriority;
  startDate?: string | null;
  endDate?: string | null;
  areaId?: string;
  parentId?: string | null;
  tools?: Array<{ name: string }>;
  responsibles?: Array<{ name: string; role?: string | null }>;
  documents?: Array<{ title: string; url?: string | null }>;
}
