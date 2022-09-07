import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";

let createUserUseCase: CreateUserUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("GetStatementOperationUseCase", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should be able to get statement", async () => {
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

    const operation = await getStatementOperationUseCase.execute({
      user_id: user.id as string,
      statement_id: statement.id as string,
    });

    expect(operation).toHaveProperty("id");
    expect(operation.amount).toBe(100);
  });

  it("should not be able with user not found", async () => {
    await expect(
      getStatementOperationUseCase.execute({
        user_id: "user_invalid",
        statement_id: "statement_invalid",
      })
    ).rejects.toEqual(new GetStatementOperationError.UserNotFound());
  });

  it("should not be able with statement not found", async () => {
    const user = await createUserUseCase.execute({
      name: "username",
      email: "teste@teste.com",
      password: "12345678",
    });

    await expect(
      getStatementOperationUseCase.execute({
        user_id: user.id as string,
        statement_id: "statement_invalid",
      })
    ).rejects.toEqual(new GetStatementOperationError.StatementNotFound());
  });
});
