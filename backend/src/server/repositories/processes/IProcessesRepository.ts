import type { IProcess } from "../../database/models";

export interface IProcessWithRelations {
  id: string;
  title: string;
  description: string | null;
  type: string;
  status: string;
  priority: string;
  startDate: Date | null;
  endDate: Date | null;
  areaId: string;
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
  area: { id: string; name: string };
  tools: Array<{ id: string; name: string }>;
  responsibles: Array<{ id: string; name: string; role: string | null }>;
  documents: Array<{ id: string; title: string; url: string | null }>;
  children: Array<{ id: string; title: string; status: string; type: string }>;
}

export interface IProcessDetails {
  id: string;
  title: string;
  description: string | null;
  type: string;
  status: string;
  priority: string;
  startDate: Date | null;
  endDate: Date | null;
  areaId: string;
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
  area: { id: string; name: string };
  tools: Array<{ id: string; name: string }>;
  responsibles: Array<{ id: string; name: string; role: string | null }>;
  documents: Array<{ id: string; title: string; url: string | null }>;
  children: Array<{
    id: string;
    title: string;
    status: string;
    type: string;
    priority?: string;
  }>;
  parent?: { id: string; title: string } | null;
}

export interface IProcessTreeNode {
  id: string;
  title: string;
  description: string | null;
  type: string;
  status: string;
  priority: string;
  parentId: string | null;
  areaId: string;
  tools: Array<{ id: string; name: string }>;
  responsibles: Array<{ id: string; name: string; role: string | null }>;
  documents: Array<{ id: string; title: string; url: string | null }>;
  children: IProcessTreeNode[];
}

export interface IPaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ICreateProcessData {
  title: string;
  description?: string | null;
  type?: "Sistemico" | "Manual";
  status?: "Planejado" | "Em_Andamento" | "Concluido" | "Cancelado";
  priority?: "Alta" | "Media" | "Baixa";
  startDate?: Date | null;
  endDate?: Date | null;
  areaId: string;
  parentId?: string | null;
  tools?: Array<{ name: string }>;
  responsibles?: Array<{ name: string; role?: string | null }>;
  documents?: Array<{ title: string; url?: string | null }>;
}

export interface IUpdateProcessData {
  title?: string | undefined;
  description?: string | null | undefined;
  type?: "Sistemico" | "Manual" | undefined;
  status?: "Planejado" | "Em_Andamento" | "Concluido" | "Cancelado" | undefined;
  priority?: "Alta" | "Media" | "Baixa" | undefined;
  startDate?: Date | null | undefined;
  endDate?: Date | null | undefined;
  areaId?: string | undefined;
  parentId?: string | null | undefined;
  tools?: Array<{ name: string }> | undefined;
  responsibles?: Array<{ name: string; role?: string | null }> | undefined;
  documents?: Array<{ title: string; url?: string | null }> | undefined;
}

export interface IProcessesRepository {
  create(data: ICreateProcessData): Promise<IProcess | Error>;
  getAll(
    page: number,
    limit: number,
    filters?: {
      search?: string | undefined;
      status?: string | undefined;
      type?: string | undefined;
      priority?: string | undefined;
      areaId?: string | undefined;
    },
  ): Promise<IPaginatedResult<IProcessWithRelations> | Error>;
  getById(id: string): Promise<IProcessDetails | null | Error>;
  getAllByArea(areaId: string): Promise<IProcessTreeNode[] | Error>;
  updateById(
    id: string,
    data: IUpdateProcessData,
  ): Promise<IProcessDetails | Error>;
  deleteById(id: string): Promise<void | Error>;
}
