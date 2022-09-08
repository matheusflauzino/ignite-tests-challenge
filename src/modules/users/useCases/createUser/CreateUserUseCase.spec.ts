import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { CreateUserError } from "./CreateUserError";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("CreateUserUseCase", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to create user", async () => {
    const user = await createUserUseCase.execute({
      name: "username",
      email: "teste@teste.com",
      password: "12345678",
    });

    expect(user).toHaveProperty("id");
  });

  it("should not be able with user already exists", async () => {
    await createUserUseCase.execute({
      name: "username",
      email: "teste@teste.com",
      password: "12345678",
    });

    await expect(
      createUserUseCase.execute({
        name: "username",
        email: "teste@teste.com",
        password: "12345678",
      })
    ).rejects.toEqual(new CreateUserError());
  });
});
