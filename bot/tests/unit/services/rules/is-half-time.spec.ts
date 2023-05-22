import { IsHalfTime } from "../../../../src/domain/services/rules/is-half-time";
import { MatchBuilder } from "../../../utils/builders/match";

test("It should be true if match is in half time", () => {
  const match = MatchBuilder.aMatch().build();
  const isHt = new IsHalfTime(match);

  const shouldBet = isHt.shouldBet();

  expect(shouldBet).toBe(true);
});

test("It should be false if match is not in half time", () => {
  const match = MatchBuilder.aFullTimeMatch().build();
  const isHt = new IsHalfTime(match);

  const shouldBet = isHt.shouldBet();

  expect(shouldBet).toBe(false);
});
