import { describe, it, beforeAll, afterAll, expect } from "vitest";
import { StatusCodes } from "http-status-codes";
import { testServer } from "../jest.setup";
import { prisma } from "../../src/server/database/prisma";

describe("Areas - GetAll", () => {
  beforeAll(async () => {
    await prisma.area.deleteMany();
    await prisma.area.createMany({
      data: [
        { name: "Recursos Humanos" },
        { name: "Financeiro" },
        { name: "Tecnologia" },
      ],
    });
  });

  afterAll(async () => {
    await prisma.area.deleteMany();
  });

  it("Should get all areas", async () => {
    const res = await testServer.get("/areas");

    expect(res.statusCode).toEqual(StatusCodes.OK);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(3);
  });

  it("Should filter areas by name", async () => {
    const res = await testServer.get("/areas?filter=Tecnologia");

    expect(res.statusCode).toEqual(StatusCodes.OK);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toEqual(1);
    expect(res.body[0].name).toEqual("Tecnologia");
  });
});
