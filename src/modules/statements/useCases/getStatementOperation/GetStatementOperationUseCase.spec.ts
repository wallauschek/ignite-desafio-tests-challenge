import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository;
let statementsRepositoryInMemory: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

describe("Exibe o total do usuário ", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      usersRepositoryInMemory,
      statementsRepositoryInMemory
    );
  });

  it("Deve exibir a transação do usuário", async () => {
    const user = await usersRepositoryInMemory.create({
      name: "User Test",
      email: "test@email.com",
      password: "123456",
    });

    const transaction = await statementsRepositoryInMemory.create({
      user_id: user.id,
      type: "withdraw" as OperationType,
      amount: 20,
      description: "Test operation",
    });

    const getStatement = await getStatementOperationUseCase.execute({
      user_id: user.id,
      statement_id: transaction.id,
    });

    expect(getStatement.id).toBe(transaction.id);
  });

  it("Não deve ser permitido exibir transação para usuário inexistente.", async () => {
    expect(async () => {
      const user = await usersRepositoryInMemory.create({
        name: "User Test",
        email: "test@email.com",
        password: "123456",
      });

      const transaction = await statementsRepositoryInMemory.create({
        user_id: user.id,
        type: "withdraw" as OperationType,
        amount: 20,
        description: "Test operation",
      });

      const lan = await getStatementOperationUseCase.execute({
        user_id: "usuario-inexistente",
        statement_id: transaction.id,
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("Não deve ser permitido exibir transação inexistente para usuário.", async () => {
    expect(async () => {
      const user1 = await usersRepositoryInMemory.create({
        name: "User Test 2",
        email: "test1@email.com",
        password: "123456",
      });

      const user2 = await usersRepositoryInMemory.create({
        name: "User Test 2",
        email: "test2@email.com",
        password: "654321",
      });

      const transaction = await statementsRepositoryInMemory.create({
        user_id: user1.id,
        type: "withdraw" as OperationType,
        amount: 20,
        description: "Test operation",
      });

      const lan = await getStatementOperationUseCase.execute({
        user_id: user2.id,
        statement_id: transaction.id,
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
});
