import type { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import type { ZodType } from "zod";

// keep same keys used previously; callers can supply body, header, params or query
// (header is retained for backwards compatibility even though express uses "headers").
// `ZodType` is the generic schema type; `ZodSchema` has been deprecated.
type TProperty = "body" | "header" | "params" | "query";
type TGetSchema = <T>(schema: ZodType<T>) => ZodType<T>;
type TAllSchemas = Record<TProperty, ZodType<any>>;
type TGetAllSchemas = (getSchema: TGetSchema) => Partial<TAllSchemas>;
type TValidation = (getAllSchemas: TGetAllSchemas) => RequestHandler;

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
