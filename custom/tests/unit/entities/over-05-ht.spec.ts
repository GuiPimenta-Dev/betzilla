import { Over05HT } from "../../../src/domain/entities/over-05-ht";

test("It should bet only if back odd is greater or equal 1.6", () => {
  const over = new Over05HT();

  const input = [
    {
      id: "1",
      back: [1.01, 1.89, 1.03],
      lay: [1.04, 1.05, 1.06],
    },
    {
      id: "2",
      back: [2.01, 2.02, 2.03],
      lay: [2.04, 2.05, 2.06],
    },
  ];
  const { shouldBet, bet } = over.bet(input);

  expect(shouldBet).toBe(true);
  expect(bet.odd).toBe(1.89);
  expect(bet.id).toBe("1");
});
