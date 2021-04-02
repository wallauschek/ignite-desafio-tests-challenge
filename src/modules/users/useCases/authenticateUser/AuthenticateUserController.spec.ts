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

  it("Deve ser possível criar token.", async () => {
    await request(app).post("/api/v1/users").send({
      name: "Teste Login",
      email: "login@email.com",
      password: "123456",
    });

    const response = await request(app).post("/api/v1/sessions").send({
      email: "login@email.com",
      password: "123456",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  // it("Não deve ser possível exibir um usuário não existente", async () => {
  //   const response = await request(app).get("/api/v1/profile").set({
  //     Authorization: `Bearer TokenInvalido`,
  //   });

  //   expect(response.status).toBe(401);
  // });
});
