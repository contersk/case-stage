import { AreasRepository } from "../../../repositories/areas";
import {
  NotFoundError,
  ConflictError,
} from "../../../shared/utils/CustomErrors";
import type { IArea } from "../../models";

const validateAreaName = async (name: string): Promise<void> => {
  const existing = await AreasRepository.getByName(name);
  if (existing instanceof Error) throw existing;
  if (existing) {
    throw new ConflictError(
      `Já existe uma área cadastrada com o nome '${name}'.`,
    );
  }
};

const getAreaOrThrow = async (id: string): Promise<IArea> => {
  const area = await AreasRepository.getById(id);
  if (area instanceof Error) throw area;
  if (!area) {
    throw new NotFoundError(`Nenhuma área encontrada com o ID '${id}'.`);
  }
  return area;
};

const create = async (data: Omit<IArea, "id">): Promise<IArea> => {
  await validateAreaName(data.name);
  const result = await AreasRepository.create(data);
  if (result instanceof Error) throw result;
  return result;
};

const getAll = async (page: number, limit: number, filter?: string) => {
  const result = await AreasRepository.getAll(page, limit, filter);
  if (result instanceof Error) throw result;
  return result;
};

const getById = async (id: string): Promise<IArea> => {
  return await getAreaOrThrow(id);
};

const updateById = async (
  id: string,
  data: Partial<Omit<IArea, "id">>,
): Promise<IArea> => {
  await getAreaOrThrow(id);
  if (data.name) await validateAreaName(data.name);
  const result = await AreasRepository.updateById(id, data);
  if (result instanceof Error) throw result;
  return result;
};

const deleteById = async (id: string): Promise<void> => {
  await getAreaOrThrow(id);
  const result = await AreasRepository.deleteById(id);
  if (result instanceof Error) throw result;
};

export const AreasService = {
  create,
  getAll,
  getById,
  updateById,
  deleteById,
};
