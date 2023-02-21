import { Over05HT } from "../../../src/domain/entities/over-05-ht";

test("It should bet only if odd is greater or equal 1.6", () => {
  const over = new Over05HT();

  expect(over.bet(1)).toBeFalsy();
  expect(over.bet(1.6)).toBeTruthy();
  expect(over.bet(2)).toBeTruthy();
});
