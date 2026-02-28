/** Envelope de resposta paginada (padrão do backend) */
export interface IPaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/** Formatos de erro retornados pela API */
export interface IApiValidationError {
  field: string;
  message: string;
}

export interface IApiErrorResponse {
  errors: {
    default?: string;
    validation?: IApiValidationError[];
    body?: Record<string, string>;
    query?: Record<string, string>;
    params?: Record<string, string>;
  };
}
