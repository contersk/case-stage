import { describe, it, beforeAll, afterAll, expect } from "vitest";
import { StatusCodes } from "http-status-codes";
import { testServer } from "../jest.setup";
import { prisma } from "../../src/server/database/prisma";

describe("Processes - GetTree", () => {
  let areaId: string;

  beforeAll(async () => {
    await prisma.process.deleteMany();
    await prisma.area.deleteMany();

    const area = await prisma.area.create({
      data: { name: "Operações" },
    });

    areaId = area.id;

    const root1 = await prisma.process.create({
      data: {
        title: "Recrutamento",
        areaId,
        type: "Manual",
        status: "Em_Andamento",
        priority: "Alta",
      },
    });

    const child = await prisma.process.create({
      data: {
        title: "Triagem de CVs",
        areaId,
        parentId: root1.id,
        type: "Manual",
        status: "Planejado",
        priority: "Media",
      },
    });

    await prisma.process.create({
      data: {
        title: "Entrevista técnica",
        areaId,
        parentId: child.id,
        type: "Manual",
        status: "Planejado",
        priority: "Baixa",
      },
    });

    await prisma.process.create({
      data: {
        title: "Onboarding",
        areaId,
        type: "Sistemico",
        status: "Planejado",
        priority: "Media",
      },
    });
  });

  afterAll(async () => {
    await prisma.process.deleteMany();
    await prisma.area.deleteMany();
  });

  it("Should return full recursive tree for area", async () => {
    const res = await testServer.get(`/areas/${areaId}/tree`);

    expect(res.statusCode).toEqual(StatusCodes.OK);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toEqual(2);

    const recrutamento = res.body.find(
      (item: any) => item.title === "Recrutamento",
    );
    expect(recrutamento).toBeDefined();
    expect(recrutamento.children.length).toEqual(1);
    expect(recrutamento.children[0].title).toEqual("Triagem de CVs");
    expect(recrutamento.children[0].children.length).toEqual(1);
    expect(recrutamento.children[0].children[0].title).toEqual(
      "Entrevista técnica",
    );
  });

  it("Should return 404 if area does not exist", async () => {
    const fakeAreaId = "00000000-0000-0000-0000-000000000000";
    const res = await testServer.get(`/areas/${fakeAreaId}/tree`);

    expect(res.statusCode).toEqual(StatusCodes.NOT_FOUND);
    expect(res.body).toHaveProperty("errors");
  });
});
