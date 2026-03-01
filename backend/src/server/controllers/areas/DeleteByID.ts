/**
 * @file Controller para exclusão de uma Área por ID.
 *
 * A exclusão é em cascata: todos os processos vinculados também são removidos.
 *
 * @route DELETE /areas/:id
 * @returns 204 No Content.
 */
import type { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";

import { AreasService } from "../../database/services/areas/AreasServices";
import { validation } from "../../shared/middleware";

export interface IParamProps {
  id?: string;
}

export const deleteValidation = validation((getSchema) => ({
  params: getSchema<IParamProps>(
    z.object({
      id: z.uuid("O parâmetro 'id' deve ser um UUID válido."),
    }),
  ),
}));

export const deleteById = async (
  req: Request<IParamProps>,
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

    await AreasService.deleteById(req.params.id);
    res.status(StatusCodes.NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
};
