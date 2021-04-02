import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../app";
import createConnection from "../../../../database/index";

let connection: Connection;
let token: string;
describe("Crias os lançamentos", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Deve ser permitido exibir o montante do usuário", async () => {
    await request(app).post("/api/v1/users").send({
      name: "Teste Login",
      email: "login@email.com",
      password: "123456",
    });

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "login@email.com",
      password: "123456",
    });

    token = responseToken.body.token;

    await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 15,
        description: "Teste deposito",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const response = await request(app)
      .get("/api/v1/statements/balance")
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(200);
    expect(response.body.balance).toBe(15);
  });

  it("Não deve ser permitido exibir balanço para usuário inexistente.", async () => {
    const response = await request(app).get("/api/v1/statements/balance").set({
      Authorization: `Bearer TokenInexistente`,
    });

    expect(response.status).toBe(401);
  });
});
