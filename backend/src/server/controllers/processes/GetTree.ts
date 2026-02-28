import type { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";

import { ProcessesService } from "../../database/services/processes/ProcessesServices";
import { validation } from "../../shared/middleware";

export interface IParamProps {
  id?: string;
}

export const getTreeValidation = validation((getSchema) => ({
  params: getSchema<IParamProps>(
    z.object({
      id: z.uuid("O parâmetro 'id' deve ser um UUID válido."),
    }),
  ),
}));

/**
 * Handler HTTP para buscar a árvore hierárquica de processos de uma área.
 * Recebe o ID da área via params e retorna um array de IProcessTreeNode (recursivo).
 * Utilizado pelo frontend para renderizar o grafo interativo com React Flow.
 */
export const getTree = async (
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

    const result = await ProcessesService.getTree(req.params.id);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
