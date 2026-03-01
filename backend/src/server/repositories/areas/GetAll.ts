import type { IArea } from "../../database/models";
import { prisma } from "../../database/prisma";

export const getAll = async (
  page: number,
  limit: number,
  filter?: string,
): Promise<
  | {
      data: (IArea & { processCount: number })[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }
  | Error
> => {
  try {
    const where: NonNullable<
      Parameters<typeof prisma.area.findMany>[0]
    >["where"] = {};

    if (filter) {
      where.name = {
        contains: filter,
        mode: "insensitive",
      };
    }

    const [data, total] = await Promise.all([
      prisma.area.findMany({
        where,
        include: {
          _count: { select: { processes: true } },
        },
        orderBy: { name: "asc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.area.count({ where }),
    ]);

    return {
      data: data.map((a) => ({
        id: a.id,
        name: a.name,
        createdAt: a.createdAt,
        updatedAt: a.updatedAt,
        processCount: a._count.processes,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error(error);
    return new Error("Erro ao buscar as áreas");
  }
};
