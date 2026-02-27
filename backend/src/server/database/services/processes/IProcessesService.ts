import type { ProcessStatus, ProcessPriority, ProcessType } from "../../models";

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

export type IUpdateProcessInput = Partial<ICreateProcessInput>;

export interface IProcessesService {
  create(data: ICreateProcessInput): Promise<any>;
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
  ): Promise<any>;
  getById(id: string): Promise<any>;
  updateById(id: string, data: IUpdateProcessInput): Promise<any>;
  deleteById(id: string): Promise<void>;
}
