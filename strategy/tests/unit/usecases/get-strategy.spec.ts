import { GetStrategy } from "../../../src/application/usecases/get-strategy";
import { InMemoryStrategyRepository } from "../../../src/infra/repositories/in-memory-strategy";
import { StrategyBuilder } from "../../utils/builders/strategy";

test("It should get a match", async () => {
  const strategyRepository = new InMemoryStrategyRepository();
  const strategy = StrategyBuilder.aStrategy().build();
  strategyRepository.create(strategy);

  const sut = new GetStrategy({ strategyRepository });
  const _strategy = await sut.execute(strategy.id);

  expect(_strategy).toEqual(strategy);
});
