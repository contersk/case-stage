/**
 * Classe base para erros da aplicação com status HTTP customizado.
 * Todas as subclasses herdam o padrão { message, statusCode }.
 * O error handler global detecta instâncias de AppError
 * e responde com o status correto automaticamente.
 */
export class AppError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
  }
}

/** Recurso não encontrado (HTTP 404). */
export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404);
  }
}

/** Requisição inválida (HTTP 400). */
export class BadRequestError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

/** Conflito de dados — violação de regra de negócio (HTTP 409). */
export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409);
  }
}
