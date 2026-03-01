/**
 * @file Controller para listagem paginada de Processos.
 *
 * Suporta filtros: `?search=`, `?status=`, `?type=`, `?priority=`, `?areaId=`
 * e paginação (`?page=&limit=`).
 *
 * @route GET /processes
 * @returns 200 OK com `{ data, total, page, limit, totalPages }`.
 */
import type { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";

import { ProcessesService } from "../../database/services/processes/ProcessesServices";
import { validation } from "../../shared/middleware";

/** Parâmetros de query aceitos na listagem de processos. */
export interface IQueryProps {
  page?: string | undefined;
  limit?: string | undefined;
  search?: string | undefined;
  status?: string | undefined;
  type?: string | undefined;
  priority?: string | undefined;
  areaId?: string | undefined;
  orderBy?: string | undefined;
  order?: string | undefined;
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
      orderBy: z
        .enum(["title", "status", "type", "priority", "createdAt"])
        .optional(),
      order: z.enum(["asc", "desc"]).optional(),
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
      orderBy: req.query.orderBy,
      order: req.query.order,
    });
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
