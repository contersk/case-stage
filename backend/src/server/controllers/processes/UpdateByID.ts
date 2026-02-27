import type { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";

import { ProcessesService } from "../../database/services/processes/ProcessesServices";
import { validation } from "../../shared/middleware";
import {
  PROCESS_STATUS_VALUES,
  PROCESS_PRIORITY_VALUES,
  PROCESS_TYPE_VALUES,
} from "../../database/models";

export interface IParamProps {
  id?: string;
}

const updateBodySchema = z.object({
  title: z
    .string()
    .min(3, "O título deve ter no mínimo 3 caracteres.")
    .max(255)
    .optional(),
  description: z.string().nullable().optional(),
  type: z.enum(PROCESS_TYPE_VALUES).optional(),
  status: z.enum(PROCESS_STATUS_VALUES).optional(),
  priority: z.enum(PROCESS_PRIORITY_VALUES).optional(),
  startDate: z
    .string()
    .datetime({
      message:
        "O campo 'startDate' deve estar no formato ISO 8601 (ex: 2026-01-01T00:00:00.000Z).",
    })
    .nullable()
    .optional(),
  endDate: z
    .string()
    .datetime({
      message:
        "O campo 'endDate' deve estar no formato ISO 8601 (ex: 2026-12-31T00:00:00.000Z).",
    })
    .nullable()
    .optional(),
  areaId: z.uuid("O campo 'areaId' deve ser um UUID válido.").optional(),
  parentId: z
    .uuid("O campo 'parentId' deve ser um UUID válido.")
    .nullable()
    .optional(),
  tools: z.array(z.object({ name: z.string().min(1) })).optional(),
  responsibles: z
    .array(
      z.object({
        name: z.string().min(1),
        role: z.string().nullable().optional(),
      }),
    )
    .optional(),
  documents: z
    .array(
      z.object({
        title: z.string().min(1),
        url: z.string().nullable().optional(),
      }),
    )
    .optional(),
});

export const updateByIdValidation = validation((getSchema) => ({
  params: getSchema<IParamProps>(
    z.object({
      id: z.uuid("O parâmetro 'id' deve ser um UUID válido."),
    }),
  ),
  body: getSchema<z.infer<typeof updateBodySchema>>(updateBodySchema),
}));

export const updateById = async (
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

    const result = await ProcessesService.updateById(req.params.id, req.body);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
