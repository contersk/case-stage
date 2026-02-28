import type { IProcess } from "../../database/models";
import { prisma } from "../../database/prisma";

export interface ICreateProcessData {
  title: string;
  description?: string | null;
  type?: "Sistemico" | "Manual";
  status?: "Planejado" | "Em_Andamento" | "Concluido" | "Cancelado";
  priority?: "Alta" | "Media" | "Baixa";
  startDate?: Date | null;
  endDate?: Date | null;
  areaId: string;
  parentId?: string | null;
  tools?: Array<{ name: string }>;
  responsibles?: Array<{ name: string; role?: string | null }>;
  documents?: Array<{ title: string; url?: string | null }>;
}

/**
 * Cria um novo processo no banco com todas as relações opcionais (tools, responsibles, documents).
 * Utiliza nested create do Prisma para inserir o processo e suas relações em uma única operação.
 * Retorna o processo criado com todas as relações incluídas.
 */
export const create = async (
  data: ICreateProcessData,
): Promise<IProcess | Error> => {
  try {
    const result = await prisma.process.create({
      data: {
        title: data.title,
        description: data.description ?? null,
        type: data.type ?? "Manual",
        status: data.status ?? "Planejado",
        priority: data.priority ?? "Media",
        startDate: data.startDate ?? null,
        endDate: data.endDate ?? null,
        areaId: data.areaId,
        parentId: data.parentId ?? null,
        ...(data.tools &&
          data.tools.length > 0 && {
            tools: {
              create: data.tools.map((t) => ({ name: t.name })),
            },
          }),
        ...(data.responsibles &&
          data.responsibles.length > 0 && {
            responsibles: {
              create: data.responsibles.map((r) => ({
                name: r.name,
                role: r.role ?? null,
              })),
            },
          }),
        ...(data.documents &&
          data.documents.length > 0 && {
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
    return result as unknown as IProcess;
  } catch (error) {
    console.error(error);
    return new Error("Erro ao cadastrar o processo");
  }
};
