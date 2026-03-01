/**
 * @file Tipos do domínio de Áreas.
 * @module types/area
 */

/** Representa uma Área organizacional retornada pela API. */
export interface IArea {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  processCount?: number;
}

/** Dados necessários para criar/atualizar uma Área. */
export interface IAreaFormData {
  name: string;
}
