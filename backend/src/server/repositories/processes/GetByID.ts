import { prisma } from "../../database/prisma";
import type { IProcessDetails } from "./IProcessesRepository";

/**
 * Busca um processo por ID com todos os relacionamentos:
 * - area (id, name)
 * - tools, responsibles, documents
 * - children (subprocessos diretos)
 * - parent (processo pai, se existir)
 *
 * Retorna null se não encontrado (tratamento feito no service).
 */
export const getById = async (
  id: string,
): Promise<IProcessDetails | null | Error> => {
  try {
    const result = await prisma.process.findUnique({
      where: { id },
      include: {
        area: { select: { id: true, name: true } },
        tools: { select: { id: true, name: true } },
        responsibles: { select: { id: true, name: true, role: true } },
        documents: { select: { id: true, title: true, url: true } },
        children: {
          select: {
            id: true,
            title: true,
            status: true,
            type: true,
            priority: true,
          },
        },
        parent: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
    return result;
  } catch (error) {
    console.error(error);
    return new Error("Erro ao buscar o processo");
  }
};
