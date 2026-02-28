import { prisma } from "../../database/prisma";
import type { IProcessTreeNode } from "./IProcessesRepository";

/**
 * Busca todos os processos de uma área para construção da árvore hierárquica.
 * Retorna uma lista plana (sem hierarquia) — a montagem da árvore é feita no service.
 * Inclui relações (tools, responsibles, documents) para cada nó.
 * Ordena por data de criação para manter consistência visual.
 */
export const getAllByArea = async (
  areaId: string,
): Promise<IProcessTreeNode[] | Error> => {
  try {
    const result = await prisma.process.findMany({
      where: { areaId },
      select: {
        id: true,
        title: true,
        description: true,
        type: true,
        status: true,
        priority: true,
        parentId: true,
        areaId: true,
        tools: { select: { id: true, name: true } },
        responsibles: { select: { id: true, name: true, role: true } },
        documents: { select: { id: true, title: true, url: true } },
      },
      orderBy: { createdAt: "asc" },
    });

    return result.map((process) => ({
      ...process,
      children: [],
    }));
  } catch (error) {
    console.error(error);
    return new Error("Erro ao buscar árvore de processos da área");
  }
};
