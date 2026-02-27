import type { IArea } from "../../database/models";
import { prisma } from "../../database/prisma";

export const updateById = async (
  id: string,
  data: Partial<Omit<IArea, "id">>,
): Promise<IArea | Error> => {
  try {
    const result = await prisma.area.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
      },
    });
    return result;
  } catch (error) {
    console.error(error);
    return new Error("Erro ao atualizar a área");
  }
};
