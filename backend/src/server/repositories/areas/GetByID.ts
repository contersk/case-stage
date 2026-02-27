import type { IArea } from "../../database/models";
import { prisma } from "../../database/prisma";

export const getById = async (id: string): Promise<IArea | null | Error> => {
  try {
    const result = await prisma.area.findUnique({
      where: { id },
    });
    return result;
  } catch (error) {
    console.error(error);
    return new Error("Erro ao buscar a área");
  }
};

export const getByName = async (
  name: string,
): Promise<IArea | null | Error> => {
  try {
    const result = await prisma.area.findFirst({
      where: { name },
    });
    return result;
  } catch (error) {
    console.error(error);
    return new Error("Erro ao buscar a área");
  }
};
