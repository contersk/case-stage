import { prisma } from "../../database/prisma";

export interface IProcessWithRelations {
  id: string;
  title: string;
  description: string | null;
  type: string;
  status: string;
  priority: string;
  startDate: Date | null;
  endDate: Date | null;
  areaId: string;
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
  area: { id: string; name: string };
  tools: Array<{ id: string; name: string }>;
  responsibles: Array<{ id: string; name: string; role: string | null }>;
  documents: Array<{ id: string; title: string; url: string | null }>;
  children: Array<{ id: string; title: string; status: string; type: string }>;
}

export const getAll = async (filters?: {
  search?: string | undefined;
  status?: string | undefined;
  type?: string | undefined;
  priority?: string | undefined;
  areaId?: string | undefined;
}): Promise<IProcessWithRelations[] | Error> => {
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

    const result = await prisma.process.findMany({
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
    });

    return result as unknown as IProcessWithRelations[];
  } catch (error) {
    console.error(error);
    return new Error("Erro ao buscar os processos");
  }
};
