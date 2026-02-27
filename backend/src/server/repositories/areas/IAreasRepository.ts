import type { IArea } from "../../database/models";

export interface IAreasRepository {
  create(data: Omit<IArea, "id">): Promise<IArea | Error>;
  getAll(
    page: number,
    limit: number,
    filter?: string,
  ): Promise<
    | {
        data: IArea[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      }
    | Error
  >;
  getById(id: string): Promise<IArea | null | Error>;
  getByName(name: string): Promise<IArea | null | Error>;
  updateById(
    id: string,
    data: Partial<Omit<IArea, "id">>,
  ): Promise<IArea | Error>;
  deleteById(id: string): Promise<void | Error>;
}
