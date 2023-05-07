import { MatchFinishedHandler } from "../../../src/application/handlers/match-finished";
import { MatchFinished } from "../../../src/domain/events/match-finished";
import { InMemoryMatchRepository } from "../../../src/infra/repositories/in-memory-match";
import { MatchBuilder } from "../../utils/builders/match";

test("It should finish a match and change the status to finished", async () => {
  const matchRepository = new InMemoryMatchRepository();
  const match = MatchBuilder.aFullTime().build();
  await matchRepository.create(match);

  const sut = new MatchFinishedHandler({ matchRepository });
  const event = new MatchFinished(match.id);
  await sut.handle(event);

  const updatedMatch = await matchRepository.findById(match.id);
  expect(updatedMatch.status).toBe("finished");
});
