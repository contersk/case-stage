import { describe, it, beforeAll, afterAll, expect } from "vitest";
import { StatusCodes } from "http-status-codes";
import { testServer } from "../jest.setup";
import { prisma } from "../../src/server/database/prisma";

describe("Processes - UpdateByID", () => {
  let processId: string;
  let areaId: string;

  beforeAll(async () => {
    await prisma.process.deleteMany();
    await prisma.area.deleteMany();
    const area = await prisma.area.create({
      data: { name: "Marketing" },
    });
    areaId = area.id;

    const process = await prisma.process.create({
      data: {
        title: "Campanha de Verão",
        areaId,
        type: "Manual",
        status: "Em_Andamento",
        priority: "Media",
      },
    });
    processId = process.id;
  });

  afterAll(async () => {
    await prisma.process.deleteMany();
    await prisma.area.deleteMany();
  });

  it("Should update a process successfully", async () => {
    const res = await testServer.put(`/processes/${processId}`).send({
      title: "Campanha de Inverno",
      status: "Concluido",
      priority: "Alta",
      areaId,
    });

    expect(res.statusCode).toEqual(StatusCodes.OK);
    expect(res.body).toHaveProperty("id");
    expect(res.body.title).toEqual("Campanha de Inverno");
    expect(res.body.status).toEqual("Concluido");
    expect(res.body.priority).toEqual("Alta");
  });

  it("Should return error if process does not exist", async () => {
    const fakeId = "00000000-0000-0000-0000-000000000000";
    const res = await testServer.put(`/processes/${fakeId}`).send({
      title: "Processo Inexistente",
      areaId,
    });

    expect(res.statusCode).toEqual(StatusCodes.NOT_FOUND);
    expect(res.body).toHaveProperty("errors");
  });

  it("Should return error if area does not exist", async () => {
    const fakeAreaId = "00000000-0000-0000-0000-000000000000";
    const res = await testServer.put(`/processes/${processId}`).send({
      title: "Campanha de Inverno",
      areaId: fakeAreaId,
    });

    expect(res.statusCode).toEqual(StatusCodes.NOT_FOUND);
    expect(res.body).toHaveProperty("errors");
  });

  it("Should return error if end date is before start date", async () => {
    const res = await testServer.put(`/processes/${processId}`).send({
      title: "Campanha de Inverno",
      areaId,
      startDate: "2026-12-31T00:00:00.000Z",
      endDate: "2026-01-01T00:00:00.000Z",
    });

    expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty("errors");
  });
});
