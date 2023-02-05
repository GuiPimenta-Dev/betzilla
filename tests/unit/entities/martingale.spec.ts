import { Martingale } from "../../../src/domain/martingale";

test("The bet value should be the same as the start when winning on martingle", () => {
  const input = {
    id: "some-id",
    initialBet: 10,
    rounds: 10,
    multiplier: 2,
  };
  const martingale = new Martingale(input);
  martingale.play(true);

  expect(martingale.nextBet()).toBe(10);
});

test("It should thrown an error if the rounds are exceeded", () => {
  const input = {
    id: "some-id",
    initialBet: 10,
    rounds: 1,
    multiplier: 2,
  };
  const martingale = new Martingale(input);
  martingale.play(true);

  expect(() => martingale.play(true)).toThrowError("Martingale Rounds Exceeded");
});

test("It should multiply the bet when losing", () => {
  const input = {
    id: "some-id",
    initialBet: 10,
    rounds: 10,
    multiplier: 2.5,
  };
  const martingale = new Martingale(input);
  martingale.play(false);

  expect(martingale.nextBet()).toBe(25);
});
