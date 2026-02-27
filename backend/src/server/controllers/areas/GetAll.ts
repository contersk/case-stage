import type { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";

import { AreasService } from "../../database/services/areas/AreasServices";
import { validation } from "../../shared/middleware";

export interface IQueryProps {
  filter?: string | undefined;
}

export const getAllValidation = validation((getSchema) => ({
  query: getSchema<IQueryProps>(
    z.object({
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
    const result = await AreasService.getAll(req.query.filter);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
