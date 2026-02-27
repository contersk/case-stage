import { describe, it, beforeAll, afterAll, expect } from "vitest";
import { StatusCodes } from "http-status-codes";
import { testServer } from "../jest.setup";
import { prisma } from "../../src/server/database/prisma";

describe("Areas - UpdateByID", () => {
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

  it("Should update an area successfully", async () => {
    const res = await testServer.put(`/areas/${areaId}`).send({
      name: "RH e Departamento Pessoal",
    });

    expect(res.statusCode).toEqual(StatusCodes.OK);
    expect(res.body).toHaveProperty("id");
    expect(res.body.name).toEqual("RH e Departamento Pessoal");
  });

  it("Should return 404 if area does not exist", async () => {
    const fakeId = "00000000-0000-0000-0000-000000000000";
    const res = await testServer.put(`/areas/${fakeId}`).send({
      name: "Financeiro",
    });

    expect(res.statusCode).toEqual(StatusCodes.NOT_FOUND);
    expect(res.body).toHaveProperty("errors");
  });

  it("Should return 409 if name already exists", async () => {
    await prisma.area.create({
      data: { name: "Financeiro" },
    });

    const res = await testServer.put(`/areas/${areaId}`).send({
      name: "Financeiro",
    });

    expect(res.statusCode).toEqual(StatusCodes.CONFLICT);
    expect(res.body).toHaveProperty("errors");
  });
});
