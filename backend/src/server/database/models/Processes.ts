/**
 * @file Modelos e constantes de domínio para Processos.
 *
 * Define os enums de Status, Prioridade e Tipo; além das interfaces
 * que representam Processos e suas entidades relacionadas
 * (Tool, Responsible, Document).
 *
 * @module models/Processes
 */

/** Valores válidos para o status de um processo. */
export const PROCESS_STATUS_VALUES = [
  "Planejado",
  "Em_Andamento",
  "Concluido",
  "Cancelado",
] as const;
/** União de literais representando o status de um processo. */
export type ProcessStatus = (typeof PROCESS_STATUS_VALUES)[number];

/** Valores válidos para a prioridade de um processo. */
export const PROCESS_PRIORITY_VALUES = ["Alta", "Media", "Baixa"] as const;
/** União de literais representando a prioridade de um processo. */
export type ProcessPriority = (typeof PROCESS_PRIORITY_VALUES)[number];

/** Valores válidos para o tipo de execução de um processo. */
export const PROCESS_TYPE_VALUES = ["Sistemico", "Manual"] as const;
/** União de literais representando o tipo de um processo. */
export type ProcessType = (typeof PROCESS_TYPE_VALUES)[number];

/**
 * Interface que representa um Processo organizacional.
 *
 * Processos suportam hierarquia (pai/filho via `parentId`) e
 * pertencem obrigatoriamente a uma Área (`areaId`).
 */
export interface IProcess {
  /** Identificador único (UUID v4) */
  id: string;
  /** Título do processo (3–255 caracteres) */
  title: string;
  /** Descrição opcional do processo */
  description?: string | null;
  /** Tipo de execução: Sistêmico ou Manual */
  type: ProcessType;
  /** Status atual do ciclo de vida */
  status: ProcessStatus;
  /** Nível de prioridade */
  priority: ProcessPriority;
  /** Data de início planejada ou real */
  startDate?: Date | null;
  /** Data de término planejada ou real */
  endDate?: Date | null;
  /** FK para a Área a qual o processo pertence */
  areaId: string;
  /** FK para o processo pai (null = processo raiz) */
  parentId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

/** Ferramenta/sistema utilizado no processo. */
export interface ITool {
  id: string;
  /** Nome da ferramenta (ex: "SAP", "Jira") */
  name: string;
  processId: string;
}

/** Pessoa responsável por um processo. */
export interface IResponsible {
  id: string;
  name: string;
  /** Cargo/função (ex: "Gerente", "Analista") */
  role?: string | null;
  processId: string;
}

/** Documento vinculado a um processo. */
export interface IDocument {
  id: string;
  /** Título do documento */
  title: string;
  /** URL externa para o documento (ex: Google Drive, SharePoint) */
  url?: string | null;
  processId: string;
}
