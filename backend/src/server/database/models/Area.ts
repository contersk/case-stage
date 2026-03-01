/**
 * Interface que representa uma Área organizacional.
 *
 * @example
 * const area: IArea = { id: "uuid", name: "Recursos Humanos" };
 */
export interface IArea {
  /** Identificador único (UUID v4) */
  id: string;
  /** Nome da área (ex: "RH", "TI", "Financeiro") — único no sistema */
  name: string;
  /** Data de criação automática */
  createdAt?: Date;
  /** Data da última atualização automática */
  updatedAt?: Date;
}
