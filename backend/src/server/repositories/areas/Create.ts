import type { IArea } from "../../database/models";
import { prisma } from "../../database/prisma";
import type { Area } from "@prisma/client";

// Recebemos os dados necessários para criar (no caso da Área, apenas o nome)
export const create = async (area: IArea): Promise<Area | Error> => {
  try {
    const result = await prisma.area.create({
      data: {
        name: area.nome,
      },
    });

    // O Prisma já retorna o objeto inteiro inserido (com ID criado, createdAt, etc.)
    return result;
  } catch (error) {
    console.error(error);
    return new Error("Erro ao cadastrar a área");
  }
};
