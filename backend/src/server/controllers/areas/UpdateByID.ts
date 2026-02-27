import type { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";

import { AreasService } from "../../database/services/areas/AreasServices";
import { validation } from "../../shared/middleware";
import type { IArea } from "../../database/models";

export interface IParamProps {
  id?: string;
}

export interface IBodyProps {
  name?: string | undefined;
}

export const updateByIdValidation = validation((getSchema) => ({
  params: getSchema<IParamProps>(
    z.object({
      id: z.uuid("O parâmetro 'id' deve ser um UUID válido."),
    }),
  ),
  body: getSchema<IBodyProps>(
    z.object({
      name: z
        .string()
        .min(3, "O nome deve ter no mínimo 3 caracteres.")
        .max(255)
        .optional(),
    }),
  ),
}));

export const updateById = async (
  req: Request<IParamProps, {}, IBodyProps>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.params.id) {
      res.status(StatusCodes.BAD_REQUEST).json({
        errors: { default: "O parâmetro 'id' é obrigatório." },
      });
      return;
    }

    const result = await AreasService.updateById(
      req.params.id,
      req.body as Partial<Omit<IArea, "id">>,
    );
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
