import { GetMatch } from "../../../src/application/usecases/get-match";
import { InMemoryMatchRepository } from "../../../src/infra/repositories/in-memory-match";
import { MatchBuilder } from "../../utils/builders/match";

test("It should get a match", async () => {
  const matchRepository = new InMemoryMatchRepository();
  const match = MatchBuilder.aMatch().build();
  matchRepository.create(match);

  const sut = new GetMatch({ matchRepository });
  const _match = await sut.execute(match.id);

  expect(_match).toEqual(match);
});
