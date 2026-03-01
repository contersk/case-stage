/**
 * @file Controller para listagem paginada de Áreas.
 *
 * Suporta filtro por nome (`?filter=`) e paginação (`?page=&limit=`).
 *
 * @route GET /areas
 * @returns 200 OK com `{ data, total, page, limit, totalPages }`.
 */
import type { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";

import { AreasService } from "../../database/services/areas/AreasServices";
import { validation } from "../../shared/middleware";

/** Parâmetros de query aceitos na listagem de áreas. */
export interface IQueryProps {
  page?: string | undefined;
  limit?: string | undefined;
  filter?: string | undefined;
}

export const getAllValidation = validation((getSchema) => ({
  query: getSchema<IQueryProps>(
    z.object({
      page: z.string().optional(),
      limit: z.string().optional(),
      filter: z.string().optional(),
    }),
  ),
}));

export const getAll = async (
  req: Request<{}, {}, {}, IQueryProps>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const result = await AreasService.getAll(page, limit, req.query.filter);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
