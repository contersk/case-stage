/**
 * @file Tipos genéricos da API.
 *
 * Definem a estrutura de respostas paginadas e erros
 * padronizados retornados pelo backend.
 *
 * @module types/api
 */

/** Resposta paginada genérica. Usada por todos os endpoints de listagem. */
export interface IPaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/** Erro de validação individual (retornado quando Zod falha no backend). */
export interface IApiValidationError {
  field: string;
  message: string;
}

/**
 * Formato padronizado de erro da API.
 *
 * O frontend usa `extractApiError()` em `lib/axios.ts` para
 * normalizar esses 3 formatos em uma mensagem legível.
 */
export interface IApiErrorResponse {
  errors: {
    /** Mensagem genérica de erro (ex: recurso não encontrado) */
    default?: string;
    /** Lista de erros de validação Zod */
    validation?: IApiValidationError[];
    /** Erros de validação agrupados por campo do body */
    body?: Record<string, string>;
    /** Erros de validação agrupados por campo da query */
    query?: Record<string, string>;
    /** Erros de validação agrupados por campo dos params */
    params?: Record<string, string>;
  };
}
