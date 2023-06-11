import { Password } from "../../../src/domain/entities/password";

test("It should be able to create a new passowrd", async () => {
  const password = await Password.create("12345678");

  expect(password.value).toBeDefined();
  expect(password.salt).toBeDefined();
});

test("It should be able to compare a password if they match", async () => {
  const password = await Password.create("12345678");

  const isEqual = await password.compare("12345678");

  expect(isEqual).toBeTruthy();
});

test("It should to compare a different password", async () => {
  const password = await Password.create("12345678");

  const isEqual = await password.compare("123456789");

  expect(isEqual).toBeFalsy();
});

test("It should not be able to create a new passowrd with less than 8 characters", async () => {
  expect(() => Password.create("1234567")).toThrowError("Invalid password");
});
