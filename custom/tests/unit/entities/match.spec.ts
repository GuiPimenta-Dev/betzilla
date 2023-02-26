import { Match, MatchStatus } from "../../../src/domain/entities/match";

test("It should create a Match with upcoming status", () => {
  const match = new Match({ id: "1", name: "Liverpool X Manchester United", date: "today", strategyId: "1" });

  expect(match.status).toBe(MatchStatus.UPCOMING);
});

test("It should parse correctly the home and away team", () => {
  const match = new Match({ id: "1", name: "Liverpool X Manchester United", date: "today", strategyId: "1" });

  expect(match.home.name).toBe("Liverpool");
  expect(match.home.score).toBe(0);
  expect(match.away.name).toBe("Manchester United");
  expect(match.away.score).toBe(0);
});

test("It should start a game", () => {
  const match = new Match({ id: "1", name: "Liverpool X Manchester United", date: "today", strategyId: "1" });

  match.startGame();

  expect(match.status).toBe(MatchStatus.IN_PROGRESS);
});

test("It should finish a game", () => {
  const match = new Match({ id: "1", name: "Liverpool X Manchester United", date: "today", strategyId: "1" });

  match.finishGame();

  expect(match.status).toBe(MatchStatus.FINISHED);
});

test("It should set the score", () => {
  const match = new Match({ id: "1", name: "Liverpool X Manchester United", date: "today", strategyId: "1" });

  match.setScore(1, 2);

  expect(match.home.score).toBe(1);
  expect(match.away.score).toBe(2);
});
