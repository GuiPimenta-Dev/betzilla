import { BetLostHandler } from "../../../src/application/handlers/bet-lost";
import { BetLost } from "../../../src/domain/events/bet-lost";
import { InMemoryMartingaleRepository } from "../../../src/infra/repositories/in-memory-martingale";
import { BetBuilder } from "../../utils/builders/bet";

test("It should lose a martingale when a bet is lost", async () => {
  const martingaleRepository = new InMemoryMartingaleRepository();
  martingaleRepository.createDefaultMartingale();

  const bet = BetBuilder.aBet().build();
  const betLost = new BetLost(bet);
  const sut = new BetLostHandler({ martingaleRepository });
  await sut.handle(betLost);

  const martingale = await martingaleRepository.findById("default");
  expect(martingale.getBet()).toBe(20);
  expect(martingale.isFinished()).toBe(true);
});
