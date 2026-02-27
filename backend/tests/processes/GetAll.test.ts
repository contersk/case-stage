import { describe, it, beforeAll, afterAll, expect } from "vitest";
import { StatusCodes } from "http-status-codes";
import { testServer } from "../jest.setup";
import { prisma } from "../../src/server/database/prisma";

describe("Processes - GetAll", () => {
  let areaId: string;

  beforeAll(async () => {
    await prisma.process.deleteMany();
    await prisma.area.deleteMany();
    const area = await prisma.area.create({
      data: { name: "Recursos Humanos" },
    });
    areaId = area.id;

    await prisma.process.createMany({
      data: [
        {
          title: "Recrutamento",
          areaId,
          type: "Manual",
          status: "Planejado",
          priority: "Alta",
        },
        {
          title: "Treinamento",
          areaId,
          type: "Sistemico",
          status: "Em_Andamento",
          priority: "Media",
        },
        {
          title: "Desligamento",
          areaId,
          type: "Manual",
          status: "Cancelado",
          priority: "Baixa",
        },
      ],
    });
  });

  afterAll(async () => {
    await prisma.process.deleteMany();
    await prisma.area.deleteMany();
  });

  it("Should get all processes", async () => {
    const res = await testServer.get("/processes");

    expect(res.statusCode).toEqual(StatusCodes.OK);
    expect(res.body).toHaveProperty("data");
    expect(res.body).toHaveProperty("total");
    expect(res.body).toHaveProperty("page");
    expect(res.body).toHaveProperty("limit");
    expect(res.body).toHaveProperty("totalPages");
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it("Should filter processes by search term", async () => {
    const res = await testServer.get("/processes?search=Recrutamento");

    expect(res.statusCode).toEqual(StatusCodes.OK);
    expect(res.body.data.length).toEqual(1);
    expect(res.body.data[0].title).toEqual("Recrutamento");
  });

  it("Should filter processes by areaId", async () => {
    const res = await testServer.get(`/processes?areaId=${areaId}`);

    expect(res.statusCode).toEqual(StatusCodes.OK);
    expect(res.body.data.length).toEqual(3);
  });

  it("Should filter processes by status", async () => {
    const res = await testServer.get("/processes?status=Planejado");

    expect(res.statusCode).toEqual(StatusCodes.OK);
    expect(res.body.data.length).toEqual(1);
    expect(res.body.data[0].title).toEqual("Recrutamento");
  });
});
