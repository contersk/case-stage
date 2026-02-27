import { prisma } from "../../database/prisma";

export const deleteById = async (id: string): Promise<void | Error> => {
  try {
    await prisma.process.delete({
      where: { id },
    });
  } catch (error) {
    console.error(error);
    return new Error("Erro ao excluir o processo");
  }
};
