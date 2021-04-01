import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let showUserProfileUseCase: ShowUserProfileUseCase;
let usersRepository: InMemoryUsersRepository;

describe("Exibir usuário", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository);
  });

  it("Deve ser possível exibir os usuário.", async () => {
    const user = await usersRepository.create({
      name: "User Test",
      email: "test@email.com",
      password: "123456",
    });

    const userReturn = await showUserProfileUseCase.execute(user.id as string);

    expect(userReturn.id).toBe(user.id);
  });

  it("Não deve ser possível exibir um usuário não existente", async () => {
    expect(async () => {
      const userReturn = await showUserProfileUseCase.execute("1234");
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
