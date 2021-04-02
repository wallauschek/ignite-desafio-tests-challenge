import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let usersRepository: InMemoryUsersRepository;

describe("Criando usuário", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
  });

  it("Deve ser possível criar um novo usuário.", async () => {
    const user = await createUserUseCase.execute({
      name: "User Test",
      email: "test@email.com",
      password: "123456",
    });
    expect(user).toHaveProperty("id");
  });

  it("Não deve ser possível criar um usuário com o mesmo email.", async () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "User Test",
        email: "test@email.com",
        password: "123456",
      });
      await createUserUseCase.execute({
        name: "User Test 2",
        email: "test@email.com",
        password: "1234567",
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
