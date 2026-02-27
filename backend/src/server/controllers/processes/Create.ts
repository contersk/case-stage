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

const processBodySchema = z.object({
  title: z
    .string()
    .min(3, "O título deve ter no mínimo 3 caracteres.")
    .max(255),
  description: z.string().nullable().optional(),
  type: z.enum(PROCESS_TYPE_VALUES).default("Manual"),
  status: z.enum(PROCESS_STATUS_VALUES).default("Planejado"),
  priority: z.enum(PROCESS_PRIORITY_VALUES).default("Media"),
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
  areaId: z.uuid("O campo 'areaId' deve ser um UUID válido."),
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

export const createValidation = validation((getSchema) => ({
  body: getSchema<z.infer<typeof processBodySchema>>(processBodySchema),
}));

export const Create = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await ProcessesService.create(req.body);
    res.status(StatusCodes.CREATED).json(result);
  } catch (error) {
    next(error);
  }
};
