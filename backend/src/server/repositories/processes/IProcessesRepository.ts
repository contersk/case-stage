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
  ): Promise<
    | {
        data: IProcessWithRelations[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      }
    | Error
  >;
  getById(id: string): Promise<any | Error>;
  updateById(id: string, data: IUpdateProcessData): Promise<any | Error>;
  deleteById(id: string): Promise<void | Error>;
}
