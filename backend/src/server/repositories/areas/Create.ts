import type { IArea } from "../../database/models";
import { prisma } from "../../database/prisma";

export const create = async (
  data: Omit<IArea, "id">,
): Promise<IArea | Error> => {
  try {
    const result = await prisma.area.create({
      data: {
        name: data.name,
      },
    });
    return result;
  } catch (error) {
    console.error(error);
    return new Error("Erro ao cadastrar a área");
  }
};
