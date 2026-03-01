/**
 * @file Configuração do cliente HTTP (Axios).
 *
 * Exporta uma instância pré-configurada com `baseURL` apontando para
 * a API (`NEXT_PUBLIC_API_BASE_URL`).
 *
 * Também exporta `extractApiError()` que normaliza 3 formatos
 * de erro da API em uma string legível para o usuário.
 *
 * @module lib/axios
 */
import axios from "axios";
import type { IApiErrorResponse } from "@/types";

/** URL base da API backend, configurável via variável de ambiente. */
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3333";

/** Instância Axios pré-configurada com baseURL e Content-Type JSON. */
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

/**
 * Normaliza qualquer erro da API em uma mensagem legível para o usuário.
 * Lida com os 3 formatos do backend:
 *  - errors.default  (AppError / 500)
 *  - errors.validation (Zod global)
 *  - errors.body / errors.query / errors.params  (middleware de validação)
 */
export function extractApiError(error: unknown): string {
  if (axios.isAxiosError<IApiErrorResponse>(error)) {
    const errors = error.response?.data?.errors;

    if (errors?.default) return errors.default;

    if (errors?.validation?.length) {
      return errors.validation.map((e) => e.message).join("; ");
    }

    // middleware validation (body/query/params)
    const fieldErrors = errors?.body ?? errors?.query ?? errors?.params;
    if (fieldErrors) {
      return Object.values(fieldErrors).join("; ");
    }

    return error.message;
  }

  if (error instanceof Error) return error.message;
  return "Ocorreu um erro inesperado.";
}
