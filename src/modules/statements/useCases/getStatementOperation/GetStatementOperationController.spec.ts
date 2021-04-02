import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../app";
import createConnection from "../../../../database/index";

let connection: Connection;
let token: string;
let id: string;
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

    const deposit = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 15,
        description: "Teste deposito",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    id = deposit.body.id;

    const response = await request(app)
      .get(`/api/v1/statements/${id}`)
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(id);
  });

  it("Não deve ser permitido exibir transação para usuário inexistente.", async () => {
    const response = await request(app).get(`/api/v1/statements/${id}`).set({
      Authorization: `Bearer tokenInexistente`,
    });

    expect(response.status).toBe(401);
  });

  it("Não deve ser permitido exibir transação inexistente para aquele usuário.", async () => {
    await request(app).post("/api/v1/users").send({
      name: "Teste Login 2",
      email: "login2@email.com",
      password: "123456",
    });

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "login2@email.com",
      password: "123456",
    });

    const deposit = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 15,
        description: "Teste deposito",
      })
      .set({
        Authorization: `Bearer ${responseToken.body.token}`,
      });

    const response = await request(app)
      .get(`/api/v1/statements/${deposit.body.id}`)
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(404);
  });
});
