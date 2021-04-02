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

  it("Deve ser permitido criar um lançamento do tipo depósito", async () => {
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

    const response = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 20,
        description: "Teste deposito",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(201);
  });

  it("Deve ser permitido criar um lançamento do tipo retirada", async () => {
    const response = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 15,
        description: "Teste retirada",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(201);
  });

  it("não deve ser permitido criar um lançamento do tipo retirada que o valor seja maior que o saldo atual", async () => {
    const response = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 15,
        description: "Teste retirada",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(400);
  });

  it("Não deve ser permitido fazer lançamento para usuário inexistente.", async () => {
    const response = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 15,
        description: "Teste retirada",
      })
      .set({
        Authorization: `Bearer tokenInexistente`,
      });

    expect(response.status).toBe(401);
  });
});
