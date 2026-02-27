import type { IArea } from "../../database/models";
import { prisma } from "../../database/prisma";

export const getAll = async (
  page: number,
  limit: number,
  filter?: string,
): Promise<
  | {
      data: IArea[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }
  | Error
> => {
  try {
    const where: Parameters<typeof prisma.area.findMany>[0]["where"] = {};

    if (filter) {
      where.name = {
        contains: filter,
        mode: "insensitive",
      };
    }

    const [data, total] = await Promise.all([
      prisma.area.findMany({
        where,
        orderBy: { name: "asc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.area.count({ where }),
    ]);

    return {
      data,
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
