import { describe, it, beforeAll, afterAll, expect } from "vitest";
import { StatusCodes } from "http-status-codes";
import { testServer } from "../jest.setup";
import { prisma } from "../../src/server/database/prisma";

describe("Processes - GetByID", () => {
  let processId: string;
  let areaId: string;

  beforeAll(async () => {
    await prisma.process.deleteMany();
    await prisma.area.deleteMany();
    const area = await prisma.area.create({
      data: { name: "Financeiro" },
    });
    areaId = area.id;

    const process = await prisma.process.create({
      data: {
        title: "Contas a Pagar",
        areaId,
        type: "Sistemico",
        status: "Planejado",
        priority: "Alta",
      },
    });
    processId = process.id;
  });

  afterAll(async () => {
    await prisma.process.deleteMany();
    await prisma.area.deleteMany();
  });

  it("Should get a process by ID", async () => {
    const res = await testServer.get(`/processes/${processId}`);

    expect(res.statusCode).toEqual(StatusCodes.OK);
    expect(res.body).toHaveProperty("id");
    expect(res.body.id).toEqual(processId);
    expect(res.body.title).toEqual("Contas a Pagar");
  });

  it("Should return error if process does not exist", async () => {
    const fakeId = "00000000-0000-0000-0000-000000000000";
    const res = await testServer.get(`/processes/${fakeId}`);

    expect(res.statusCode).toEqual(StatusCodes.NOT_FOUND);
    expect(res.body).toHaveProperty("errors");
  });

  it("Should return error if ID is invalid", async () => {
    const res = await testServer.get("/processes/invalid-id");

    expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty("errors");
  });
});
