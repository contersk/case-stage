import type { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";

import { ProcessesService } from "../../database/services/processes/ProcesssesServices";
import { validation } from "../../shared/middleware";

export interface IQueryProps {
  search?: string | undefined;
  status?: string | undefined;
  type?: string | undefined;
  priority?: string | undefined;
  areaId?: string | undefined;
}

export const getAllValidation = validation((getSchema) => ({
  query: getSchema<IQueryProps>(
    z.object({
      search: z.string().optional(),
      status: z.string().optional(),
      type: z.string().optional(),
      priority: z.string().optional(),
      areaId: z.uuid().optional(),
    }),
  ),
}));

export const getAll = async (
  req: Request<{}, {}, {}, IQueryProps>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await ProcessesService.getAll(req.query);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
