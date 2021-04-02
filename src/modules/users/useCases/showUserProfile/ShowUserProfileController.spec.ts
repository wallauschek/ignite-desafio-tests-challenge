import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../app";
import createConnection from "../../../../database/index";

let connection: Connection;
describe("Controller que exibe informações do usuário", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });
  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Deve ser possível exibir as informações do usuário.", async () => {
    await request(app).post("/api/v1/users").send({
      name: "Teste Show Controller",
      email: "testshow@mail.com",
      password: "123456",
    });

    const session = await request(app).post("/api/v1/sessions").send({
      email: "testshow@mail.com",
      password: "123456",
    });

    const response = await request(app)
      .get("/api/v1/profile")
      .set({
        Authorization: `Bearer ${session.body.token}`,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
  });

  it("Não deve ser possível exibir um usuário não existente", async () => {
    const response = await request(app).get("/api/v1/profile").set({
      Authorization: `Bearer TokenInvalido`,
    });

    expect(response.status).toBe(401);
  });
});
