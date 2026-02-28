import type { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import type { ZodType } from "zod";

// Tipagens para o middleware de validação usando Zod

// TProperty representa as partes da requisição que podem ser validadas
type TProperty = "body" | "header" | "params" | "query";
// TGetSchema é uma função que recebe um schema Zod e retorna o mesmo tipo de schema
type TGetSchema = <T>(schema: ZodType<T>) => ZodType<T>;
// TAllSchemas é um tipo que representa um objeto onde as chaves são as partes da requisição e os valores são schemas Zod
type TAllSchemas = Record<TProperty, ZodType<any>>;
// TGetAllSchemas é uma função que recebe a função TGetSchema e retorna um objeto parcial de TAllSchemas, ou seja, pode conter apenas algumas das partes da requisição
type TGetAllSchemas = (getSchema: TGetSchema) => Partial<TAllSchemas>;
// TValidation é o tipo do middleware de validação, que recebe a função TGetAllSchemas e retorna um RequestHandler do Express
type TValidation = (getAllSchemas: TGetAllSchemas) => RequestHandler;

/**
 * Middleware genérico de validação baseado em Zod.
 * Permite validar qualquer combinação de body, params, query e headers em uma única chamada.
 *
 * Uso nos controllers:
 * ```ts
 * export const createValidation = validation((getSchema) => ({
 *   body: getSchema<IBodyProps>(zod.object({ name: zod.string().min(3) })),
 *   params: getSchema<IParamProps>(zod.object({ id: zod.uuid() })),
 * }));
 * ```
 *
 * Se a validação falhar, retorna 400 com os erros agrupados por parte da request (body, params, etc.).
 * Se passar, chama next() para o controller handler.
 */
export const validation: TValidation =
  (getAllSchemas) => async (req, res, next) => {
    const schemas = getAllSchemas((schema) => schema);
    const errorsResult: Record<string, Record<string, string>> = {};

    Object.entries(schemas).forEach(([key, schema]) => {
      const target = req[key as TProperty] as unknown;
      const result = schema.safeParse(target);
      if (!result.success) {
        const zodErr = result.error;
        const errors: Record<string, string> = {};
        zodErr.issues.forEach((issue) => {
          if (!issue.path || issue.path.length === 0) return;
          errors[issue.path.join(".")] = issue.message;
        });
        errorsResult[key] = errors;
      }
    });

    if (Object.entries(errorsResult).length === 0) {
      return next();
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({
        errors: errorsResult,
      });
    }
  };
