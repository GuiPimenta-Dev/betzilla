import { IsFullTime } from "../../../src/domain/services/rules/is-full-time";
import { MatchBuilder } from "../../utils/builders/match";

test("It should be true if match is in full time", () => {
  const match = MatchBuilder.aFullTimeMatch().build();
  const isFt = new IsFullTime(match);

  const shouldBet = isFt.shouldBet();

  expect(shouldBet).toBe(true);
});

test("It should be false if match is not in full time", () => {
  const match = MatchBuilder.aMatch().build();
  const isFT = new IsFullTime(match);

  const shouldBet = isFT.shouldBet();

  expect(shouldBet).toBe(false);
});
