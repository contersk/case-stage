import { AreasRepository } from "../../../repositories/areas";
import type { IAreasRepository } from "../../../repositories/areas/IAreasRepository";
import {
  NotFoundError,
  ConflictError,
} from "../../../shared/utils/CustomErrors";
import type { IArea } from "../../models";
import type { IAreasService } from "./IAreasService";

class AreasServiceImpl implements IAreasService {
  constructor(private readonly areasRepository: IAreasRepository) {}

  private async validateAreaName(name: string): Promise<void> {
    const existing = await this.areasRepository.getByName(name);
    if (existing instanceof Error) throw existing;
    if (existing) {
      throw new ConflictError(
        `Já existe uma área cadastrada com o nome '${name}'.`,
      );
    }
  }

  private async getAreaOrThrow(id: string): Promise<IArea> {
    const area = await this.areasRepository.getById(id);
    if (area instanceof Error) throw area;
    if (!area) {
      throw new NotFoundError(`Nenhuma área encontrada com o ID '${id}'.`);
    }
    return area;
  }

  async create(data: Omit<IArea, "id">): Promise<IArea> {
    await this.validateAreaName(data.name);
    const result = await this.areasRepository.create(data);
    if (result instanceof Error) throw result;
    return result;
  }

  async getAll(page: number, limit: number, filter?: string) {
    const result = await this.areasRepository.getAll(page, limit, filter);
    if (result instanceof Error) throw result;
    return result;
  }

  async getById(id: string): Promise<IArea> {
    return await this.getAreaOrThrow(id);
  }

  async updateById(
    id: string,
    data: Partial<Omit<IArea, "id">>,
  ): Promise<IArea> {
    await this.getAreaOrThrow(id);
    if (data.name) await this.validateAreaName(data.name);
    const result = await this.areasRepository.updateById(id, data);
    if (result instanceof Error) throw result;
    return result;
  }

  async deleteById(id: string): Promise<void> {
    await this.getAreaOrThrow(id);
    const result = await this.areasRepository.deleteById(id);
    if (result instanceof Error) throw result;
  }
}

export const AreasService: IAreasService = new AreasServiceImpl(
  AreasRepository,
);
