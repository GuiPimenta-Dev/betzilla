import { IsPositiveEV } from "../../../../src/domain/services/rules/is-positive-ev";

test("It should return false if expected ev is negative", () => {
  const odds = [
    {
      id: "1",
      back: [2.32],
      lay: [2.34],
    },
    {
      id: "2",
      back: [13.5],
      lay: [14],
    },
    {
      id: "3",
      back: [6.6],
      lay: [6.8],
    },
  ];
  const isPositiveEV = new IsPositiveEV(odds, "home", "back", 10);

  const shouldBet = isPositiveEV.shouldBet();

  expect(shouldBet).toBe(false);
});

test("It should return true if expected ev is positive", () => {
  const odds = [
    {
      id: "1",
      back: [1.5],
      lay: [1.29],
    },
    {
      id: "2",
      back: [2],
      lay: [14],
    },
    {
      id: "3",
      back: [1.8],
      lay: [6.8],
    },
  ];
  const isPositiveEV = new IsPositiveEV(odds, "home", "back", 10);

  const shouldBet = isPositiveEV.shouldBet();

  expect(shouldBet).toBe(true);
});

test("It should return false case there are less options than the possible result", () => {
  const odds = [
    {
      id: "1",
      back: [1.5],
      lay: [1.29],
    },
    {
      id: "2",
      back: [2],
      lay: [14],
    },
  ];
  const isPositiveEV = new IsPositiveEV(odds, "draw", "back", 10);

  const shouldBet = isPositiveEV.shouldBet();

  expect(shouldBet).toBe(false);
});
