import { Login } from "../../../src/application/usecases/login";
import { InMemoryPlayerRepository } from "../../../src/infra/repositories/in-memory-player";

test("It should be able to login with a valid email and password", async () => {
  const playerRepository = new InMemoryPlayerRepository();
  await playerRepository.createDefaultPlayer();

  const input = { email: "default@test.com", password: "12345678" };
  const usecase = new Login({ playerRepository });
  const { token } = await usecase.execute(input);

  expect(token).toBeDefined();
});

test("It should throw an error if the email is not found", async () => {
  const playerRepository = new InMemoryPlayerRepository();

  const input = { email: "default@test.com", password: "12345678" };
  const usecase = new Login({ playerRepository });

  await expect(usecase.execute(input)).rejects.toThrow("Authentication failed");
});

test("It should throw an error if the password is invalid", async () => {
  const playerRepository = new InMemoryPlayerRepository();
  await playerRepository.createDefaultPlayer();

  const input = { email: "default@test.com", password: "different-password" };
  const usecase = new Login({ playerRepository });

  await expect(usecase.execute(input)).rejects.toThrow("Authentication failed");
});
