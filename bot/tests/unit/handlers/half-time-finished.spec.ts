import { HalfTimeFinishedHandler } from "../../../src/application/handlers/half-time-finished";
import { HalfTimeFinished } from "../../../src/domain/events/half-time-finished";
import { InMemoryMatchRepository } from "../../../src/infra/repositories/in-memory-match";
import { MatchBuilder } from "../../utils/builders/match";

test("It should finish the half time and change the status to full-time", async () => {
  const matchRepository = new InMemoryMatchRepository();
  const match = MatchBuilder.aMatch().build();
  await matchRepository.create(match);

  const sut = new HalfTimeFinishedHandler({ matchRepository });
  const event = new HalfTimeFinished(match.id);
  await sut.handle(event);

  const updatedMatch = await matchRepository.findById(match.id);
  expect(updatedMatch.status).toBe("full-time");
});
