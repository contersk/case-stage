import { ProcessesRepository } from "../../../repositories/processes";
import { AreasRepository } from "../../../repositories/areas";
import {
  NotFoundError,
  ConflictError,
  BadRequestError,
} from "../../../shared/utils/CustomErrors";
import type { ProcessStatus, ProcessPriority, ProcessType } from "../../models";

interface ICreateProcessInput {
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

type IUpdateProcessInput = Partial<ICreateProcessInput>;

// Validate that area exists
const validateAreaExists = async (areaId: string): Promise<void> => {
  const area = await AreasRepository.getById(areaId);
  if (area instanceof Error) throw area;
  if (!area) {
    throw new NotFoundError(`A área com ID '${areaId}' não foi encontrada.`);
  }
};

// Validate process exists and return it
const getProcessOrThrow = async (id: string) => {
  const process = await ProcessesRepository.getById(id);
  if (process instanceof Error) throw process;
  if (!process) {
    throw new NotFoundError(`O processo com ID '${id}' não foi encontrado.`);
  }
  return process;
};

// Rule: a process cannot be its own parent
const validateNoSelfParent = (id: string, parentId?: string | null): void => {
  if (parentId && parentId === id) {
    throw new ConflictError("Um processo não pode ser pai de si mesmo.");
  }
};

// Rule: parent must exist
const validateParentExists = async (
  parentId?: string | null,
): Promise<void> => {
  if (!parentId) return;
  await getProcessOrThrow(parentId);
};

// Rule: child must be in the same area as parent
const validateParentArea = async (
  childAreaId: string,
  parentId?: string | null,
): Promise<void> => {
  if (!parentId) return;
  const parentProcess = await getProcessOrThrow(parentId);
  if (parentProcess.areaId !== childAreaId) {
    throw new ConflictError(
      "A área do processo filho deve ser a mesma do processo pai.",
    );
  }
};

// Rule: endDate >= startDate
const validateDateRange = (
  startDate?: string | null,
  endDate?: string | null,
): void => {
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end < start) {
      throw new BadRequestError(
        "A data de término deve ser maior ou igual à data de início.",
      );
    }
  }
};

const validateProcess = async (
  data: ICreateProcessInput,
  currentId?: string,
): Promise<void> => {
  await validateAreaExists(data.areaId);
  if (currentId) validateNoSelfParent(currentId, data.parentId);
  await validateParentExists(data.parentId);
  await validateParentArea(data.areaId, data.parentId);
  validateDateRange(data.startDate, data.endDate);
};

const create = async (data: ICreateProcessInput) => {
  await validateProcess(data);

  const result = await ProcessesRepository.create({
    ...data,
    startDate: data.startDate ? new Date(data.startDate) : null,
    endDate: data.endDate ? new Date(data.endDate) : null,
  });

  if (result instanceof Error) throw result;
  return result;
};

const getAll = async (
  page: number,
  limit: number,
  filters?: {
    search?: string | undefined;
    status?: string | undefined;
    type?: string | undefined;
    priority?: string | undefined;
    areaId?: string | undefined;
  },
) => {
  const result = await ProcessesRepository.getAll(page, limit, filters);
  if (result instanceof Error) throw result;
  return result;
};

const getById = async (id: string) => {
  return await getProcessOrThrow(id);
};

const updateById = async (id: string, data: IUpdateProcessInput) => {
  const currentProcess = await getProcessOrThrow(id);

  // Merge current data with updates for validation
  const mergedData: ICreateProcessInput = {
    title: data.title ?? currentProcess.title,
    description:
      data.description !== undefined
        ? data.description
        : currentProcess.description,
    type: (data.type ?? currentProcess.type) as ProcessType,
    status: (data.status ?? currentProcess.status) as ProcessStatus,
    priority: (data.priority ?? currentProcess.priority) as ProcessPriority,
    startDate:
      data.startDate !== undefined
        ? data.startDate
        : (currentProcess.startDate?.toISOString() ?? null),
    endDate:
      data.endDate !== undefined
        ? data.endDate
        : (currentProcess.endDate?.toISOString() ?? null),
    areaId: data.areaId ?? currentProcess.areaId,
    parentId:
      data.parentId !== undefined ? data.parentId : currentProcess.parentId,
  };

  await validateProcess(mergedData, id);

  const result = await ProcessesRepository.updateById(id, {
    ...data,
    startDate:
      data.startDate !== undefined
        ? data.startDate
          ? new Date(data.startDate)
          : null
        : undefined,
    endDate:
      data.endDate !== undefined
        ? data.endDate
          ? new Date(data.endDate)
          : null
        : undefined,
  });

  if (result instanceof Error) throw result;
  return result;
};

const deleteById = async (id: string): Promise<void> => {
  await getProcessOrThrow(id);
  const result = await ProcessesRepository.deleteById(id);
  if (result instanceof Error) throw result;
};

export const ProcessesService = {
  create,
  getAll,
  getById,
  updateById,
  deleteById,
};
