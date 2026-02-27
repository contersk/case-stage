import { describe, it, beforeAll, afterAll, expect } from "vitest";
import { StatusCodes } from "http-status-codes";
import { testServer } from "../jest.setup";
import { prisma } from "../../src/server/database/prisma";

describe("Areas - DeleteByID", () => {
  let areaId: string;

  beforeAll(async () => {
    await prisma.area.deleteMany();
    const area = await prisma.area.create({
      data: { name: "Recursos Humanos" },
    });
    areaId = area.id;
  });

  afterAll(async () => {
    await prisma.area.deleteMany();
  });

  it("Should delete an area successfully", async () => {
    const res = await testServer.delete(`/areas/${areaId}`);

    expect(res.statusCode).toEqual(StatusCodes.NO_CONTENT);

    const checkArea = await prisma.area.findUnique({
      where: { id: areaId },
    });
    expect(checkArea).toBeNull();
  });

  it("Should return 404 if area does not exist", async () => {
    const fakeId = "00000000-0000-0000-0000-000000000000";
    const res = await testServer.delete(`/areas/${fakeId}`);

    expect(res.statusCode).toEqual(StatusCodes.NOT_FOUND);
    expect(res.body).toHaveProperty("errors");
  });
});
