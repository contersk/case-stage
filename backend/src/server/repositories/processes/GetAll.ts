import { prisma } from "../../database/prisma";
import type {
  IProcessWithRelations,
  IPaginatedResult,
} from "./IProcessesRepository";

/**
 * Busca paginada de processos com filtros dinâmicos.
 * Suporta filtros por:
 * - search: busca case-insensitive em title e description (OR)
 * - status, type, priority: filtro exato por enum
 * - areaId: filtro por área
 *
 * Executa count e findMany em paralelo (Promise.all) para performance.
 * Retorna dados paginados com metadata (total, page, limit, totalPages).
 */
export const getAll = async (
  page: number,
  limit: number,
  filters?: {
    search?: string | undefined;
    status?: string | undefined;
    type?: string | undefined;
    priority?: string | undefined;
    areaId?: string | undefined;
  },
): Promise<IPaginatedResult<IProcessWithRelations> | Error> => {
  try {
    const where: Record<string, unknown> = {};

    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
      ];
    }
    if (filters?.status) where.status = filters.status;
    if (filters?.type) where.type = filters.type;
    if (filters?.priority) where.priority = filters.priority;
    if (filters?.areaId) where.areaId = filters.areaId;

    const [data, total] = await Promise.all([
      prisma.process.findMany({
        where,
        include: {
          area: { select: { id: true, name: true } },
          tools: { select: { id: true, name: true } },
          responsibles: { select: { id: true, name: true, role: true } },
          documents: { select: { id: true, title: true, url: true } },
          children: {
            select: { id: true, title: true, status: true, type: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.process.count({ where }),
    ]);

    return {
      data: data as unknown as IProcessWithRelations[],
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error(error);
    return new Error("Erro ao buscar os processos");
  }
};
