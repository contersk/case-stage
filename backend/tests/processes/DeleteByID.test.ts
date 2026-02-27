import { describe, it, beforeAll, afterAll, expect } from "vitest";
import { StatusCodes } from "http-status-codes";
import { testServer } from "../jest.setup";
import { prisma } from "../../src/server/database/prisma";

describe("Processes - DeleteByID", () => {
  let processId: string;
  let areaId: string;

  beforeAll(async () => {
    await prisma.process.deleteMany();
    await prisma.area.deleteMany();
    const area = await prisma.area.create({
      data: { name: "Vendas" },
    });
    areaId = area.id;

    const process = await prisma.process.create({
      data: {
        title: "Prospecção",
        areaId,
        type: "Manual",
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

  it("Should delete a process successfully", async () => {
    const res = await testServer.delete(`/processes/${processId}`);

    expect(res.statusCode).toEqual(StatusCodes.NO_CONTENT);

    const deletedProcess = await prisma.process.findUnique({
      where: { id: processId },
    });
    expect(deletedProcess).toBeNull();
  });

  it("Should return error if process does not exist", async () => {
    const fakeId = "00000000-0000-0000-0000-000000000000";
    const res = await testServer.delete(`/processes/${fakeId}`);

    expect(res.statusCode).toEqual(StatusCodes.NOT_FOUND);
    expect(res.body).toHaveProperty("errors");
  });

  it("Should return error if ID is invalid", async () => {
    const res = await testServer.delete("/processes/invalid-id");

    expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty("errors");
  });
});
