import type { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";

import { ProcessesService } from "../../database/services/processes/ProcessesServices";
import { validation } from "../../shared/middleware";

export interface IQueryProps {
  page?: string | undefined;
  limit?: string | undefined;
  search?: string | undefined;
  status?: string | undefined;
  type?: string | undefined;
  priority?: string | undefined;
  areaId?: string | undefined;
}

export const getAllValidation = validation((getSchema) => ({
  query: getSchema<IQueryProps>(
    z.object({
      page: z.string().optional(),
      limit: z.string().optional(),
      search: z.string().optional(),
      status: z.string().optional(),
      type: z.string().optional(),
      priority: z.string().optional(),
      areaId: z.uuid().optional(),
    }),
  ),
}));

/**
 * Handler HTTP para listagem paginada de processos.
 * Suporta filtros via query string: search, status, type, priority, areaId.
 * Retorna IPaginatedResult com data[], total, page, limit, totalPages.
 */
export const getAll = async (
  req: Request<{}, {}, {}, IQueryProps>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const result = await ProcessesService.getAll(page, limit, {
      search: req.query.search,
      status: req.query.status,
      type: req.query.type,
      priority: req.query.priority,
      areaId: req.query.areaId,
    });
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
