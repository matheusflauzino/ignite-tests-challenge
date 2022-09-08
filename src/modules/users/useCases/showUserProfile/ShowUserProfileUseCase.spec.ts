import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("ShowUserUseCase", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(
      inMemoryUsersRepository
    );
  });

  it("should be able to show profile user", async () => {
    const user = await createUserUseCase.execute({
      name: "username",
      email: "teste@teste.com",
      password: "12345678",
    });

    const profile = await showUserProfileUseCase.execute(user.id as string);

    expect(profile).toHaveProperty("id");
  });

  it("should not be able with user not found", async () => {
    await expect(
      showUserProfileUseCase.execute("invalid_user")
    ).rejects.toEqual(new ShowUserProfileError());
  });
});
