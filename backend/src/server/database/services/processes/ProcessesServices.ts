import { ProcessesRepository } from "../../../repositories/processes";
import { AreasRepository } from "../../../repositories/areas";
import type { IAreasRepository } from "../../../repositories/areas/IAreasRepository";
import type { IProcessesRepository } from "../../../repositories/processes/IProcessesRepository";
import {
  NotFoundError,
  ConflictError,
  BadRequestError,
} from "../../../shared/utils/CustomErrors";
import type { ProcessStatus, ProcessPriority, ProcessType } from "../../models";
import type {
  IProcessesService,
  ICreateProcessInput,
  IUpdateProcessInput,
} from "./IProcessesService";

class ProcessesServiceImpl implements IProcessesService {
  constructor(
    private readonly processesRepository: IProcessesRepository,
    private readonly areasRepository: IAreasRepository,
  ) {}

  private async validateAreaExists(areaId: string): Promise<void> {
    const area = await this.areasRepository.getById(areaId);
    if (area instanceof Error) throw area;
    if (!area) {
      throw new NotFoundError(`A área com ID '${areaId}' não foi encontrada.`);
    }
  }

  private async getProcessOrThrow(id: string) {
    const process = await this.processesRepository.getById(id);
    if (process instanceof Error) throw process;
    if (!process) {
      throw new NotFoundError(`O processo com ID '${id}' não foi encontrado.`);
    }
    return process;
  }

  private validateNoSelfParent(id: string, parentId?: string | null): void {
    if (parentId && parentId === id) {
      throw new ConflictError("Um processo não pode ser pai de si mesmo.");
    }
  }

  private async validateParentExists(parentId?: string | null): Promise<void> {
    if (!parentId) return;
    await this.getProcessOrThrow(parentId);
  }

  private async validateParentArea(
    childAreaId: string,
    parentId?: string | null,
  ): Promise<void> {
    if (!parentId) return;
    const parentProcess = await this.getProcessOrThrow(parentId);
    if (parentProcess.areaId !== childAreaId) {
      throw new ConflictError(
        "A área do processo filho deve ser a mesma do processo pai.",
      );
    }
  }

  private validateDateRange(
    startDate?: string | null,
    endDate?: string | null,
  ): void {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (end < start) {
        throw new BadRequestError(
          "A data de término deve ser maior ou igual à data de início.",
        );
      }
    }
  }

  private async validateProcess(
    data: ICreateProcessInput,
    currentId?: string,
  ): Promise<void> {
    await this.validateAreaExists(data.areaId);
    if (currentId) this.validateNoSelfParent(currentId, data.parentId);
    await this.validateParentExists(data.parentId);
    await this.validateParentArea(data.areaId, data.parentId);
    this.validateDateRange(data.startDate, data.endDate);
  }

  async create(data: ICreateProcessInput) {
    await this.validateProcess(data);

    const result = await this.processesRepository.create({
      ...data,
      startDate: data.startDate ? new Date(data.startDate) : null,
      endDate: data.endDate ? new Date(data.endDate) : null,
    });

    if (result instanceof Error) throw result;
    return result;
  }

  async getAll(
    page: number,
    limit: number,
    filters?: {
      search?: string | undefined;
      status?: string | undefined;
      type?: string | undefined;
      priority?: string | undefined;
      areaId?: string | undefined;
    },
  ) {
    const result = await this.processesRepository.getAll(page, limit, filters);
    if (result instanceof Error) throw result;
    return result;
  }

  async getById(id: string) {
    return await this.getProcessOrThrow(id);
  }

  async updateById(id: string, data: IUpdateProcessInput) {
    const currentProcess = await this.getProcessOrThrow(id);

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

    await this.validateProcess(mergedData, id);

    const result = await this.processesRepository.updateById(id, {
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
  }

  async deleteById(id: string): Promise<void> {
    await this.getProcessOrThrow(id);
    const result = await this.processesRepository.deleteById(id);
    if (result instanceof Error) throw result;
  }
}

export const ProcessesService: IProcessesService = new ProcessesServiceImpl(
  ProcessesRepository,
  AreasRepository,
);
