import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { CreateStatementError } from "./CreateStatementError";

let createUserUseCase: CreateUserUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase;

describe("CreateStantement", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should be able to create a deposit", async () => {
    const user = await createUserUseCase.execute({
      name: "username",
      email: "teste@teste.com",
      password: "12345678",
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id as string,
      type: "deposit" as OperationType,
      amount: 100,
      description: "teste",
    });

    expect(statement).toHaveProperty("id");
  });

  it("should be able to create a withdraw", async () => {
    const user = await createUserUseCase.execute({
      name: "username",
      email: "teste@teste.com",
      password: "12345678",
    });

    await createStatementUseCase.execute({
      user_id: user.id as string,
      type: "deposit" as OperationType,
      amount: 100,
      description: "teste",
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id as string,
      type: "withdraw" as OperationType,
      amount: 100,
      description: "teste",
    });

    expect(statement).toHaveProperty("id");
  });

  it("should not be able with user not found", async () => {
    await expect(
      createStatementUseCase.execute({
        user_id: "user_invalid",
        type: "deposit" as OperationType,
        amount: 100,
        description: "teste",
      })
    ).rejects.toEqual(new CreateStatementError.UserNotFound());
  });

  it("should not be able with insufficient funds", async () => {
    const user = await createUserUseCase.execute({
      name: "username",
      email: "teste@teste.com",
      password: "12345678",
    });

    await createStatementUseCase.execute({
      user_id: user.id as string,
      type: "deposit" as OperationType,
      amount: 100,
      description: "teste",
    });

    await expect(
      createStatementUseCase.execute({
        user_id: user.id as string,
        type: "withdraw" as OperationType,
        amount: 200,
        description: "teste",
      })
    ).rejects.toEqual(new CreateStatementError.InsufficientFunds());
  });
});
