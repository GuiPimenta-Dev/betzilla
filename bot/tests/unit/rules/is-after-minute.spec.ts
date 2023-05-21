import moment from "moment";
import { IsAfterMinute } from "../../../src/domain/services/rules/is-after-minute";
import { MatchBuilder } from "../../utils/builders/match";

test("It should make the bet if match is after minute 15", () => {
  const twentyMinutesAgo = moment().subtract(20, "minutes").toDate();
  const match = MatchBuilder.aMatch().withDate(twentyMinutesAgo).build();

  const isAfterMinute = new IsAfterMinute(match, 15);
  const shouldBet = isAfterMinute.shouldBet();

  expect(shouldBet).toBeTruthy();
});

test("It should make the bet if match is equal minute 15", () => {
  const fifteenMinutesAgo = moment().subtract(15, "minutes").toDate();
  const match = MatchBuilder.aMatch().withDate(fifteenMinutesAgo).build();

  const isAfterMinute = new IsAfterMinute(match, 15);
  const shouldBet = isAfterMinute.shouldBet();

  expect(shouldBet).toBeTruthy();
});

test("It should not make the bet if match is before minute 15", () => {
  const tenMinutesAgo = moment().subtract(10, "minutes").toDate();
  const match = MatchBuilder.aMatch().withDate(tenMinutesAgo).build();

  const isAfterMinute = new IsAfterMinute(match, 15);
  const shouldBet = isAfterMinute.shouldBet();

  expect(shouldBet).toBeFalsy();
});
