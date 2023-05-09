import { IsBelowOdd } from "../../../src/domain/rules/is-below-odd";

test("It should return true if back odd is equal to max odd", () => {
  const odds = [
    {
      id: "1",
      back: [1.01, 1.5, 1.03],
      lay: [1.04, 1.05, 1.06],
    },
  ];
  const isBelowOdd = new IsBelowOdd(odds, 1.02, "back");

  const shouldBet = isBelowOdd.shouldBet();

  expect(shouldBet).toBe(true);
});

test("It should return false if lay odd is more than max odd", () => {
  const odds = [
    {
      id: "1",
      back: [1.01, 1.5, 1.03],
      lay: [1.04, 1.05, 1.06],
    },
  ];
  const isBelowOdd = new IsBelowOdd(odds, 1.01, "lay");

  const shouldBet = isBelowOdd.shouldBet();

  expect(shouldBet).toBe(false);
});
