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
import type {
  IProcessDetails,
  IProcessTreeNode,
  IProcessWithRelations,
  IPaginatedResult,
} from "../../../repositories/processes";

/**
 * Serviço de negócio para Processos.
 * Implementa validações complexas de integridade hierárquica:
 * - A área referenciada deve existir
 * - O processo pai (se informado) deve existir e pertencer à mesma área
 * - Um processo não pode ser pai de si mesmo
 * - A data de término deve ser >= data de início
 * - Relações (tools, responsibles, documents) usam replace strategy em updates
 */
class ProcessesServiceImpl implements IProcessesService {
  constructor(
    private readonly processesRepository: IProcessesRepository,
    private readonly areasRepository: IAreasRepository,
  ) {}

  /** Valida que a área referenciada existe. Lança NotFoundError 404 se não encontrada. */
  private async validateAreaExists(areaId: string): Promise<void> {
    const area = await this.areasRepository.getById(areaId);
    if (area instanceof Error) throw area;
    if (!area) {
      throw new NotFoundError(`A área com ID '${areaId}' não foi encontrada.`);
    }
  }

  /** Busca processo pelo ID ou lança NotFoundError 404. */
  private async getProcessOrThrow(id: string) {
    const process = await this.processesRepository.getById(id);
    if (process instanceof Error) throw process;
    if (!process) {
      throw new NotFoundError(`O processo com ID '${id}' não foi encontrado.`);
    }
    return process;
  }

  /** Impede que um processo seja definido como pai de si mesmo. Lança ConflictError 409. */
  private validateNoSelfParent(id: string, parentId?: string | null): void {
    if (parentId && parentId === id) {
      throw new ConflictError("Um processo não pode ser pai de si mesmo.");
    }
  }

  private async validateParentExists(parentId?: string | null): Promise<void> {
    if (!parentId) return;
    await this.getProcessOrThrow(parentId);
  }

  /**
   * Garante que o processo pai pertence à mesma área que o filho.
   * Regra: subprocessos devem estar na mesma área do processo raiz.
   * Lança ConflictError 409 se as áreas divergirem.
   */
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

  /** Valida que endDate >= startDate quando ambos estão preenchidos. Lança BadRequestError 400. */
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

  /**
   * Executa todas as validações de negócio para criação/atualização de processo:
   * 1. Área existe
   * 2. Não é auto-referência (se currentId informado)
   * 3. Processo pai existe (se parentId informado)
   * 4. Processo pai pertence à mesma área
   * 5. Range de datas válido
   */
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

  async create(data: ICreateProcessInput): Promise<IProcessDetails> {
    await this.validateProcess(data);

    const result = await this.processesRepository.create({
      ...data,
      startDate: data.startDate ? new Date(data.startDate) : null,
      endDate: data.endDate ? new Date(data.endDate) : null,
    });

    if (result instanceof Error) throw result;
    return result as IProcessDetails;
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
  ): Promise<IPaginatedResult<IProcessWithRelations>> {
    const result = await this.processesRepository.getAll(page, limit, filters);
    if (result instanceof Error) throw result;
    return result;
  }

  async getById(id: string): Promise<IProcessDetails> {
    return (await this.getProcessOrThrow(id)) as IProcessDetails;
  }

  /**
   * Constrói a árvore hierárquica recursivamente a partir de uma lista plana de processos.
   * Filtra os processos cujo parentId corresponde ao nível atual e anexa os filhos recursivamente.
   * Complexidade: O(n²) no pior caso — aceitável para árvores organizacionais de tamanho moderado.
   */
  private buildTree(
    processes: Array<Omit<IProcessTreeNode, "children">>,
    parentId: string | null,
  ): IProcessTreeNode[] {
    return processes
      .filter((process) => process.parentId === parentId)
      .map((process) => ({
        ...process,
        children: this.buildTree(processes, process.id),
      }));
  }

  /**
   * Retorna a árvore hierárquica completa de processos de uma área.
   * Busca todos os processos da área no banco (flat) e monta a árvore em memória via buildTree().
   * Os nós raiz são aqueles com parentId === null.
   */
  async getTree(areaId: string): Promise<IProcessTreeNode[]> {
    await this.validateAreaExists(areaId);
    const allProcesses = await this.processesRepository.getAllByArea(areaId);

    if (allProcesses instanceof Error) throw allProcesses;

    const flattened = allProcesses.map((process) => ({
      id: process.id,
      title: process.title,
      description: process.description,
      type: process.type,
      status: process.status,
      priority: process.priority,
      parentId: process.parentId,
      areaId: process.areaId,
      tools: process.tools,
      responsibles: process.responsibles,
      documents: process.documents,
    }));

    return this.buildTree(flattened, null);
  }

  /**
   * Atualiza parcialmente um processo.
   * Mescla os campos enviados com os valores atuais para re-validar todas as regras de negócio.
   * As relações (tools, responsibles, documents) usam replace strategy:
   * os registros antigos são deletados e os novos criados dentro de uma transação.
   */
  async updateById(
    id: string,
    data: IUpdateProcessInput,
  ): Promise<IProcessDetails> {
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
    return result as IProcessDetails;
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
