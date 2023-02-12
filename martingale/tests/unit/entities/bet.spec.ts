import { BetBuilder } from "../../utils/builders/bet";

test("It should define an id when the bet is created", () => {
  const bet = BetBuilder.aBet().build();

  expect(bet.id).toBeDefined();
});

test("The bet strategy name should be 'martingale'", () => {
  const bet = BetBuilder.aBet().build();

  expect(bet.strategy.name).toBe("martingale");
});

test("the outcome should be null when the bet is created", () => {
  const bet = BetBuilder.aBet().build();

  expect(bet.outcome).toBeNull();
});

test("The number of attempts should be 0 when the bet is created", () => {
  const bet = BetBuilder.aBet().build();

  expect(bet.attempts).toBe(0);
});

test("The number of attempts should increase when the bet is retried", () => {
  const bet = BetBuilder.aBet().build();

  bet.retry();

  expect(bet.attempts).toBe(1);
});

test("It should throw an error if the max attempts is reached", () => {
  const bet = BetBuilder.aBet().build();
  bet.retry();
  bet.retry();
  bet.retry();

  expect(() => bet.retry()).toThrowError("Max attempts reached");
});
