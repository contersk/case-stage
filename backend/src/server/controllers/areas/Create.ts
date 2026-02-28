import type { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import * as zod from "zod";

import { AreasService } from "../../database/services/areas/AreasServices";
import { validation } from "../../shared/middleware";
import type { IArea } from "../../database/models";

export interface IBodyProps extends Omit<IArea, "id"> {}

/**
 * Schema de validação do body para criação de área.
 * Requer name com mínimo de 3 e máximo de 255 caracteres.
 */
export const createValidation = validation((getSchema) => ({
  body: getSchema<IBodyProps>(
    zod.object({
      name: zod
        .string()
        .min(3, "O nome deve ter no mínimo 3 caracteres.")
        .max(255),
    }),
  ),
}));

/** Handler HTTP para criação de área. Retorna 201 Created com o objeto criado. */
export const Create = async (
  req: Request<{}, {}, IBodyProps>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await AreasService.create(req.body);
    res.status(StatusCodes.CREATED).json(result);
  } catch (error) {
    next(error);
  }
};
