import { MatchStatus } from "../../../src/domain/entities/match";
import { MatchBuilder } from "../../utils/builders/match";

test("It should create a Match with half time status", () => {
  const match = MatchBuilder.aMatch().build();

  expect(match.status).toBe(MatchStatus.HALF_TIME);
});

test("It should parse correctly the home and away team", () => {
  const match = MatchBuilder.aMatch().build();

  expect(match.home.name).toBe("A");
  expect(match.home.score).toBe(0);
  expect(match.away.name).toBe("B");
  expect(match.away.score).toBe(0);
});

test("It should be full time", () => {
  const match = MatchBuilder.aMatch().build();

  match.finishHalfTime();

  expect(match.status).toBe(MatchStatus.FULL_TIME);
});

test("It should finish a game", () => {
  const match = MatchBuilder.aMatch().build();

  match.finish();

  expect(match.status).toBe(MatchStatus.FINISHED);
});

test("It should set the score", () => {
  const match = MatchBuilder.aMatch().build();

  match.setScore(1, 2);

  expect(match.home.score).toBe(1);
  expect(match.away.score).toBe(2);
});
