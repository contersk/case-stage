import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/CustomErrors";

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  // Zod validation errors
  if (err && typeof err === "object" && "issues" in err) {
    const zodErr = err as {
      issues: Array<{ path: (string | number)[]; message: string }>;
    };
    res.status(400).json({
      errors: {
        validation: zodErr.issues.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      },
    });
    return;
  }

  // Custom application errors
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      errors: { default: err.message },
    });
    return;
  }

  // Generic errors
  res.status(500).json({
    errors: { default: "Erro interno do servidor" },
  });
};
