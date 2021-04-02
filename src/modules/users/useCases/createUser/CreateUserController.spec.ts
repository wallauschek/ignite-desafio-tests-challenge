import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../app";
import createConnection from "../../../../database/index";

let connection: Connection;
describe("Controller de Autenticação", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Deve ser possível criar um novo usuário", async () => {
    const response = await request(app).post("/api/v1/users").send({
      name: "Teste Controller",
      email: "test@mail.com",
      password: "123456",
    });

    expect(response.status).toBe(201);
  });

  it("Não deve ser possível criar um usuário com o mesmo email.", async () => {
    const response = await request(app).post("/api/v1/users").send({
      name: "Teste Controller 2",
      email: "test@mail.com",
      password: "123456",
    });

    expect(response.status).toBe(400);
  });
});
