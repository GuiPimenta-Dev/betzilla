import { MatchStartedHandler } from "../../../src/application/handlers/match-started";
import { MatchStarted } from "../../../src/domain/events/match-started";
import { InMemoryMatchRepository } from "../../../src/infra/repositories/in-memory-match";
import { MatchBuilder } from "../../utils/builders/match";

test("It should start a match and change the status to half-time", async () => {
  const matchRepository = new InMemoryMatchRepository();
  const match = MatchBuilder.aUpcoming().build();
  await matchRepository.create(match);

  const sut = new MatchStartedHandler({ matchRepository });
  const event = new MatchStarted(match.id);
  await sut.handle(event);

  const updatedMatch = await matchRepository.findById(match.id);
  expect(updatedMatch.status).toBe("half-time");
});
