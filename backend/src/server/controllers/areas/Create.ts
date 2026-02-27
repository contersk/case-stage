import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as zod from "zod";

import { AreasProvider } from "../../repositories/areas";
import { validation } from "../../shared/middleware";
import type { IArea } from "../../database/models";

interface IBodyProps extends Omit<IArea, "id"> {}

export const createValidation = validation((getSchema) => ({
  body: getSchema<IBodyProps>(
    zod.object({
      nome: zod.string().min(3).max(150),
    }),
  ),
}));

export const Create = async (
  req: Request<{}, {}, IArea>,
  res: Response,
): Promise<Response> => {
  const result = await AreasProvider.create(req.body);

  if (result instanceof Error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: {
        default: result.message,
      },
    });
  }

  return res.status(StatusCodes.CREATED).json(result);
};
