import { Signup } from "../../../src/application/usecases/sign-up";
import { InMemoryPlayerRepository } from "../../../src/infra/repositories/in-memory-player";

test("It should create a new player in the repository", async () => {
  const playerRepository = new InMemoryPlayerRepository();
  const input = { name: "username", email: "test@test.com", password: "12345678" };

  const usecase = new Signup({ playerRepository });
  await usecase.execute(input);

  const player = await playerRepository.findByEmail(input.email);
  expect(player).not.toBeNull();
});

test("It should hash the password before saving in the database", async () => {
  const playerRepository = new InMemoryPlayerRepository();
  const input = { name: "username", email: "test@gmail.com", password: "12345678" };

  const usecase = new Signup({ playerRepository });
  await usecase.execute(input);

  const player = await playerRepository.findByEmail(input.email);
  expect(player?.password.value).not.toBe(input.password);
  expect(player?.password.value).toHaveLength(128);
  expect(player?.password.salt).toBeDefined();
});

test("It should throw an error if the email is already in use", async () => {
  const playerRepository = new InMemoryPlayerRepository();
  await playerRepository.createDefaultPlayer();
  const input = { name: "username", email: "default@test.com", password: "12345678" };

  const usecase = new Signup({ playerRepository });
  await expect(usecase.execute(input)).rejects.toThrow("Email already Exists");
});

test("It should create a player with a balance of 0", async () => {
  const playerRepository = new InMemoryPlayerRepository();
  const input = { name: "username", email: "test@test.com", password: "12345678" };

  const usecase = new Signup({ playerRepository });
  await usecase.execute(input);

  const player = await playerRepository.findByEmail(input.email);
  expect(player?.account.balance).toBe(0);
});
