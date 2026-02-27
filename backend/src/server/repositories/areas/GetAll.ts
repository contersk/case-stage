import type { IArea } from "../../database/models";
import { prisma } from "../../database/prisma";

export const getAll = async (filter?: string): Promise<IArea[] | Error> => {
  try {
    const findArgs: Parameters<typeof prisma.area.findMany>[0] = {
      orderBy: { name: "asc" },
    };
    if (filter) {
      findArgs.where = {
        name: {
          contains: filter,
          mode: "insensitive",
        },
      };
    }
    const result = await prisma.area.findMany(findArgs);
    return result;
  } catch (error) {
    console.error(error);
    return new Error("Erro ao buscar as áreas");
  }
};
