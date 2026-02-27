import type { IArea } from "../../database/models";
import { prisma } from "../../database/prisma";
import type { Area } from "@prisma/client";

export const deleteById = async (id: string): Promise<void | Error> => {
  try {
    const result = await prisma.area.delete({
      where: {
        id,
      },
    });

    if (result) {
      return;
    }

    return new Error("Erro ao excluir o registro");
  } catch (error) {
    console.log(error);
    return new Error("Erro ao excluir o registro");
  }
};
