import { describe, it, beforeAll, afterAll, expect } from "vitest";
import { StatusCodes } from "http-status-codes";
import { testServer } from "../jest.setup";
import { prisma } from "../../src/server/database/prisma";

describe("Processes - Create", () => {
  let areaId: string;

  beforeAll(async () => {
    await prisma.process.deleteMany();
    await prisma.area.deleteMany();
    const area = await prisma.area.create({
      data: { name: "Tecnologia" },
    });
    areaId = area.id;
  });

  afterAll(async () => {
    await prisma.process.deleteMany();
    await prisma.area.deleteMany();
  });

  it("Should create a process successfully", async () => {
    const res = await testServer.post("/processes").send({
      title: "Desenvolvimento de Software",
      description: "Processo de criação de software",
      type: "Sistemico",
      status: "Em_Andamento",
      priority: "Alta",
      areaId,
    });

    expect(res.statusCode).toEqual(StatusCodes.CREATED);
    expect(res.body).toHaveProperty("id");
    expect(res.body.title).toEqual("Desenvolvimento de Software");
    expect(res.body.areaId).toEqual(areaId);
  });

  it("Should return error if area does not exist", async () => {
    const fakeAreaId = "00000000-0000-0000-0000-000000000000";
    const res = await testServer.post("/processes").send({
      title: "Processo Inválido",
      areaId: fakeAreaId,
    });

    expect(res.statusCode).toEqual(StatusCodes.NOT_FOUND);
    expect(res.body).toHaveProperty("errors");
  });

  it("Should return error if end date is before start date", async () => {
    const res = await testServer.post("/processes").send({
      title: "Processo com Data Inválida",
      areaId,
      startDate: "2026-12-31T00:00:00.000Z",
      endDate: "2026-01-01T00:00:00.000Z",
    });

    expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty("errors");
  });
});
