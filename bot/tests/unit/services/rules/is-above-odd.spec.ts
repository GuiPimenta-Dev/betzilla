import { IsAboveOdd } from "../../../../src/domain/services/rules/is-above-odd";

test("It should return true if back odd is equal to minimum odd", () => {
  const odds = [
    {
      id: "1",
      back: [1.01, 1.5, 1.03],
      lay: [1.04, 1.05, 1.06],
    },
  ];
  const isAboveOdd = new IsAboveOdd(odds, 1.5, "back");

  const shouldBet = isAboveOdd.shouldBet();

  expect(shouldBet).toBe(true);
});

test("It should return false if lay odd is less than minimum odd", () => {
  const odds = [
    {
      id: "1",
      back: [1.01, 1.5, 1.03],
      lay: [1.04, 1.05, 1.06],
    },
  ];
  const isAboveOdd = new IsAboveOdd(odds, 1.5, "lay");

  const shouldBet = isAboveOdd.shouldBet();

  expect(shouldBet).toBe(false);
});
