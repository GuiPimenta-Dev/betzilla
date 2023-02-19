import { Martingale } from "../../../src/domain/entities/martingale";

test("The bet value should be the same as the start when winning on martingle", () => {
  const input = {
    id: "some-id",
    playerId: "account-id",
    initialBet: 10,
    rounds: 10,
    multiplier: 2,
    resetAfter: 3

  };
  const martingale = new Martingale(input);
  martingale.win();

  expect(martingale.getBet()).toBe(10);
});

test("It should thrown an error if the rounds are exceeded", () => {
  const input = {
    id: "some-id",
    playerId: "account-id",
    initialBet: 10,
    rounds: 1,
    multiplier: 2,
    resetAfter: 3
  };
  const martingale = new Martingale(input);
  martingale.win();

  expect(() => martingale.lose()).toThrowError("Martingale Rounds Exceeded");
});

test("It should decrease one round after winning", () => {
  const input = {
    id: "some-id",
    playerId: "account-id",
    initialBet: 10,
    rounds: 1,
    multiplier: 2,
    resetAfter: 3
  };
  const martingale = new Martingale(input);
  martingale.win();

  expect(martingale.isFinished()).toBe(true);
});

test("It should decrease one round after losing", () => {
  const input = {
    id: "some-id",
    playerId: "account-id",
    initialBet: 10,
    rounds: 1,
    multiplier: 2,
    resetAfter: 3
  };
  const martingale = new Martingale(input);
  martingale.lose();

  expect(martingale.isFinished()).toBe(true);
});

test("It should multiply the bet when losing", () => {
  const input = {
    id: "some-id",
    playerId: "account-id",
    initialBet: 10,
    rounds: 10,
    multiplier: 2.5,
    resetAfter: 3
  };
  const martingale = new Martingale(input);
  martingale.lose();

  expect(martingale.getBet()).toBe(25);
});

test("It should start with the status 'playing''", () => {
  const input = {
    id: "some-id",
    playerId: "account-id",
    initialBet: 10,
    rounds: 10,
    multiplier: 2.5,
    resetAfter: 3
    };
    const martingale = new Martingale(input);

    expect(martingale.status).toBe("playing");
});

test("It should reset the bet value when losing 3 times in a row", () => {
  const input = {
    id: "some-id",
    playerId: "account-id",
    initialBet: 10,
    rounds: 10,
    multiplier: 2.5,
    resetAfter: 3
  };
  const martingale = new Martingale(input);
  martingale.lose();
  martingale.lose();
  martingale.lose();

  expect(martingale.getBet()).toBe(10);
}
)

test("It should reset the rounds lost when winning", () => {
  const input = {
    id: "some-id",
    playerId: "account-id",
    initialBet: 10,
    rounds: 10,
    multiplier: 2.5,
    resetAfter: 3
  };
  const martingale = new Martingale(input);
  martingale.lose();
  martingale.lose();
  martingale.win();

  expect(martingale.roundsLost).toBe(0);
});