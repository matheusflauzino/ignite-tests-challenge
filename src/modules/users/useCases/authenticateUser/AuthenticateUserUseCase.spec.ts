import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("AuthenticateUserUseCase", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUsersRepository
    );
  });

  it("should be able to authenticate user", async () => {
    const user = {
      name: "User name",
      email: "email@mail.com",
      password: "senhasuperdificil",
    };

    await createUserUseCase.execute(user);
    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(result).toHaveProperty("token");
  });

  it("should not be able user not found", async () => {
    await expect(
      authenticateUserUseCase.execute({
        email: "invalid_user@teste.com",
        password: "12345678",
      })
    ).rejects.toEqual(new IncorrectEmailOrPasswordError());
  });

  it("should not be able pass error", async () => {
    const user = await createUserUseCase.execute({
      name: "username",
      email: "teste@teste.com",
      password: "12345678",
    });
    await expect(
      authenticateUserUseCase.execute({
        email: user.email,
        password: "invalid",
      })
    ).rejects.toEqual(new IncorrectEmailOrPasswordError());
  });
});
