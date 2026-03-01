import type { ProcessStatus, ProcessPriority, ProcessType } from "../../models";
import type {
  IProcessDetails,
  IProcessWithRelations,
  IProcessTreeNode,
  IPaginatedResult,
} from "../../../repositories/processes";

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
  create(data: ICreateProcessInput): Promise<IProcessDetails>;
  getAll(
    page: number,
    limit: number,
    filters?: {
      search?: string | undefined;
      status?: string | undefined;
      type?: string | undefined;
      priority?: string | undefined;
      areaId?: string | undefined;
      orderBy?: string | undefined;
      order?: string | undefined;
    },
  ): Promise<IPaginatedResult<IProcessWithRelations>>;
  getById(id: string): Promise<IProcessDetails>;
  getTree(areaId: string): Promise<IProcessTreeNode[]>;
  updateById(id: string, data: IUpdateProcessInput): Promise<IProcessDetails>;
  deleteById(id: string): Promise<void>;
}
