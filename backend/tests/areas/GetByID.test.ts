/// <reference types="vitest" />
import { describe, it, beforeAll, afterAll, expect } from "vitest";
import { StatusCodes } from "http-status-codes";
import { testServer } from "../jest.setup";
import { prisma } from "../../src/server/database/prisma";

describe("Areas - GetByID", () => {
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

  it("Should get an area by ID", async () => {
    const res = await testServer.get(`/areas/${areaId}`);

    expect(res.statusCode).toEqual(StatusCodes.OK);
    expect(res.body).toHaveProperty("id");
    expect(res.body.name).toEqual("Recursos Humanos");
  });

  it("Should return 404 if area does not exist", async () => {
    const fakeId = "00000000-0000-0000-0000-000000000000";
    const res = await testServer.get(`/areas/${fakeId}`);

    expect(res.statusCode).toEqual(StatusCodes.NOT_FOUND);
    expect(res.body).toHaveProperty("errors");
  });

  it("Should return 400 if ID is not a valid UUID", async () => {
    const res = await testServer.get("/areas/invalid-id");

    expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res.body.errors.params).toBeDefined();
  });
});
