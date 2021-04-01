import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository;
let statementsRepositoryInMemory: InMemoryStatementsRepository;
let getBalanceUseCase: GetBalanceUseCase;

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

describe("Exibe o total do usuário ", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      statementsRepositoryInMemory,
      usersRepositoryInMemory
    );
  });

  it("Deve exibir o montante total do usuário", async () => {
    const user = await usersRepositoryInMemory.create({
      name: "User Test",
      email: "test@email.com",
      password: "123456",
    });

    await statementsRepositoryInMemory.create({
      user_id: user.id,
      type: "deposit" as OperationType,
      amount: 20,
      description: "Test operation",
    });

    await statementsRepositoryInMemory.create({
      user_id: user.id,
      type: "deposit" as OperationType,
      amount: 20,
      description: "Test operation",
    });

    const getBalance = await getBalanceUseCase.execute({
      user_id: user.id,
    });

    expect(getBalance.balance).toBe(40);
  });

  it("Não deve ser permitido exibir balanço para usuário inexistente.", async () => {
    expect(async () => {
      const lan = await getBalanceUseCase.execute({
        user_id: "usuario-inexistente",
      });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});
