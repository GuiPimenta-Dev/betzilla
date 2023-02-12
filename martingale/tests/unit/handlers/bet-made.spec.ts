import { BetMadeHandler } from "../../../src/application/handlers/bet-made";
import { BetMade } from "../../../src/domain/events/bet-made";
import { InMemoryMartingaleRepository } from "../../../src/infra/repositories/in-memory-martingale";
import { BetBuilder } from "../../utils/builders/bet";

test("It should save an item in history when bet is made", async () => {
  const martingaleRepository = new InMemoryMartingaleRepository();
  martingaleRepository.createDefaultMartingale();

  const bet = BetBuilder.aBet().build();
  const betMade = new BetMade(bet);
  const sut = new BetMadeHandler({ martingaleRepository });
  await sut.handle(betMade);

  const history = await martingaleRepository.findHistory("default");
  expect(history[0]).toMatchObject({
    martingaleId: "default",
    winner: "pending",
    investiment: 10,
    outcome: null,
    profit: null,
  });
  expect(history[0].betId).toBeDefined();
});
