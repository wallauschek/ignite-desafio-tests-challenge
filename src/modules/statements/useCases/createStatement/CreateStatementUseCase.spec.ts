import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";

import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { CreateStatementError } from "./CreateStatementError";

let createStatementUseCase: CreateStatementUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;
let statementRepositoryInMemory: InMemoryStatementsRepository;

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

describe("Crias os lançamentos", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    statementRepositoryInMemory = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      usersRepositoryInMemory,
      statementRepositoryInMemory
    );
  });

  it("Deve ser permitido criar um lançamento", async () => {
    const user = await usersRepositoryInMemory.create({
      name: "User Test",
      email: "test@email.com",
      password: "123456",
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id,
      type: "deposit" as OperationType,
      amount: 20,
      description: "Test operation",
    });

    expect(statement).toHaveProperty("id");
  });

  it("Não deve ser permitido fazer lançamento para usuário inexistente.", async () => {
    expect(async () => {
      const lan = await createStatementUseCase.execute({
        user_id: "usuario-inexistente",
        type: "deposit" as OperationType,
        amount: 20,
        description: "Test operation",
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("Não deve ser permitido fazer retirada para valores superiores ao retido", async () => {
    expect(async () => {
      const user = await usersRepositoryInMemory.create({
        name: "User Test",
        email: "test@email.com",
        password: "123456",
      });

      await createStatementUseCase.execute({
        user_id: user.id,
        type: "withdraw" as OperationType,
        amount: 20,
        description: "Test operation",
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
});
