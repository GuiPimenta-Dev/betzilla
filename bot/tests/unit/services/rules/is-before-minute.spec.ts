import moment from "moment";
import { IsBeforeMinute } from "../../../../src/domain/services/rules/is-before-minute";
import { MatchBuilder } from "../../../utils/builders/match";

test("It should make the bet if match is before minute 15", () => {
  const fiveMinutesAgo = moment().subtract(5, "minutes").toDate();
  const match = MatchBuilder.aMatch().withDate(fiveMinutesAgo).build();

  const isAfterMinute = new IsBeforeMinute(match, 15);
  const shouldBet = isAfterMinute.shouldBet();

  expect(shouldBet).toBeTruthy();
});

test("It should make the bet if match is equal minute 15", () => {
  const fifteenMinutesAgo = moment().subtract(15, "minutes").toDate();
  const match = MatchBuilder.aMatch().withDate(fifteenMinutesAgo).build();

  const isAfterMinute = new IsBeforeMinute(match, 15);
  const shouldBet = isAfterMinute.shouldBet();

  expect(shouldBet).toBeTruthy();
});

test("It should not make the bet if match is after minute 15", () => {
  const thirtyMinutesAgo = moment().subtract(30, "minutes").toDate();
  const match = MatchBuilder.aMatch().withDate(thirtyMinutesAgo).build();

  const isAfterMinute = new IsBeforeMinute(match, 15);
  const shouldBet = isAfterMinute.shouldBet();

  expect(shouldBet).toBeFalsy();
});
