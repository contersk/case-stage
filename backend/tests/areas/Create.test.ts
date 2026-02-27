import { describe, it, beforeAll, afterAll, expect } from "vitest";
import { StatusCodes } from "http-status-codes";
import { testServer } from "../jest.setup";
import { prisma } from "../../src/server/database/prisma";

describe("Areas - Create", () => {
  beforeAll(async () => {
    await prisma.area.deleteMany();
  });

  afterAll(async () => {
    await prisma.area.deleteMany();
  });

  it("Should create an area successfully", async () => {
    const res = await testServer.post("/areas").send({
      name: "Recursos Humanos",
    });

    expect(res.statusCode).toEqual(StatusCodes.CREATED);
    expect(res.body).toHaveProperty("id");
    expect(res.body.name).toEqual("Recursos Humanos");
  });

  it("Should return error if name is too short", async () => {
    const res = await testServer.post("/areas").send({
      name: "RH",
    });

    expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res.body.errors.body).toBeDefined();
  });

  it("Should not create an area with a duplicate name", async () => {
    await testServer.post("/areas").send({
      name: "Financeiro",
    });

    const res = await testServer.post("/areas").send({
      name: "Financeiro",
    });

    expect(res.statusCode).toEqual(StatusCodes.CONFLICT);
    expect(res.body).toHaveProperty("errors");
  });
});
