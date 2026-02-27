import type { IArea } from "../../models";

export interface IAreasService {
  create(data: Omit<IArea, "id">): Promise<IArea>;
  getAll(
    page: number,
    limit: number,
    filter?: string,
  ): Promise<{
    data: IArea[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;
  getById(id: string): Promise<IArea>;
  updateById(id: string, data: Partial<Omit<IArea, "id">>): Promise<IArea>;
  deleteById(id: string): Promise<void>;
}
