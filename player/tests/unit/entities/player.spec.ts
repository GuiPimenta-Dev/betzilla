import { Password } from "../../../src/domain/entities/password";
import { Player } from "../../../src/domain/entities/player";

test("It should create an account when creating a new player", async () => {
  const password = await Password.create("12345678");

  const player = new Player({ id: "id", email: "email@test.com", password, name: "username", balance: 0 });

  expect(player.account.getBalance()).toBe(0);
});

test("It should raise an error when creating a new player with an invalid email", async () => {
  const password = await Password.create("12345678");

  expect(() => new Player({ id: "id", email: "email", password, name: "username", balance: 0 })).toThrowError(
    "Invalid email"
  );
});

test("It should raise an error when creating a new player with an invalid name", async () => {
  const password = await Password.create("12345678");

  expect(() => new Player({ id: "id", email: "test@test.com", password, name: "", balance: 0 })).toThrowError(
    "Invalid name"
  );
});

test("It should be able to compare a player password if they match", async () => {
  const password = await Password.create("12345678");
  const player = new Player({ id: "id", email: "email@test.com", password, name: "username", balance: 0 });

  const isEqual = await player.validatePassword("12345678");

  expect(isEqual).toBeTruthy();
});

test("It should to compare a player different password", async () => {
  const password = await Password.create("12345678");
  const player = new Player({ id: "id", email: "email@test.com", password, name: "username", balance: 0 });

  const isEqual = await player.validatePassword("123456789");

  expect(isEqual).toBeFalsy();
});
