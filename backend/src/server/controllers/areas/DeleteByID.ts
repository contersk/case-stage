import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { z } from "zod"; // Padrão da comunidade usar 'z'

import { AreasService } from "../../services/areas/AreasService"; // Alterado para Service
import { validation } from "../../shared/middleware";

// 1. O tipo do ID muda de number para string
interface IParamProps {
  id?: string;
}

// 2. Validação usando o validador nativo de UUID do Zod
export const deleteValidation = validation((getSchema) => ({
  params: getSchema<IParamProps>(
    z.object({
      id: z.string().uuid("O parâmetro 'id' deve ser um UUID válido."),
    }),
  ),
}));

export const deleteById = async (req: Request<IParamProps>, res: Response) => {
  if (!req.params.id) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      errors: {
        default: "O parâmetro 'id' é obrigatório.",
      },
    });
  }

  // 3. Removemos a conversão Number(). Passamos a string diretamente para o Service
  const result = await AreasService.deleteById(req.params.id);

  if (result instanceof Error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: {
        default: result.message,
      },
    });
  }

  return res.status(StatusCodes.NO_CONTENT).send();
};
