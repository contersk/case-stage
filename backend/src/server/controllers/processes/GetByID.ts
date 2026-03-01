/**
 * @file Controller para busca de um Processo por ID.
 *
 * Retorna o processo com todas as relações (area, tools, responsibles,
 * documents, children, parent).
 *
 * @route GET /processes/:id
 * @returns 200 OK com IProcessDetails ou 404.
 */
import type { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";

import { ProcessesService } from "../../database/services/processes/ProcessesServices";
import { validation } from "../../shared/middleware";

export interface IParamProps {
  id?: string;
}

export const getByIdValidation = validation((getSchema) => ({
  params: getSchema<IParamProps>(
    z.object({
      id: z.uuid("O parâmetro 'id' deve ser um UUID válido."),
    }),
  ),
}));

export const getById = async (
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

    const result = await ProcessesService.getById(req.params.id);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
