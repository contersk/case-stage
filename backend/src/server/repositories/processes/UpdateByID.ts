import { prisma } from "../../database/prisma";
import type {
  IUpdateProcessData,
  IProcessDetails,
} from "./IProcessesRepository";

export const updateById = async (
  id: string,
  data: IUpdateProcessData,
): Promise<IProcessDetails | Error> => {
  try {
    // If related data is provided, delete-then-recreate (replace strategy)
    const result = await prisma.$transaction(async (tx) => {
      if (data.tools !== undefined) {
        await tx.tool.deleteMany({ where: { processId: id } });
      }
      if (data.responsibles !== undefined) {
        await tx.responsible.deleteMany({ where: { processId: id } });
      }
      if (data.documents !== undefined) {
        await tx.document.deleteMany({ where: { processId: id } });
      }

      return await tx.process.update({
        where: { id },
        data: {
          ...(data.title !== undefined && { title: data.title }),
          ...(data.description !== undefined && {
            description: data.description,
          }),
          ...(data.type !== undefined && { type: data.type }),
          ...(data.status !== undefined && { status: data.status }),
          ...(data.priority !== undefined && { priority: data.priority }),
          ...(data.startDate !== undefined && { startDate: data.startDate }),
          ...(data.endDate !== undefined && { endDate: data.endDate }),
          ...(data.areaId !== undefined && { areaId: data.areaId }),
          ...(data.parentId !== undefined && { parentId: data.parentId }),
          ...(data.tools !== undefined && {
            tools: {
              create: data.tools.map((t) => ({ name: t.name })),
            },
          }),
          ...(data.responsibles !== undefined && {
            responsibles: {
              create: data.responsibles.map((r) => ({
                name: r.name,
                role: r.role ?? null,
              })),
            },
          }),
          ...(data.documents !== undefined && {
            documents: {
              create: data.documents.map((d) => ({
                title: d.title,
                url: d.url ?? null,
              })),
            },
          }),
        },
        include: {
          tools: true,
          responsibles: true,
          documents: true,
          area: true,
          children: true,
        },
      });
    });

    return result;
  } catch (error) {
    console.error(error);
    return new Error("Erro ao atualizar o processo");
  }
};
