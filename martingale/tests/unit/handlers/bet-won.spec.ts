import { BetWonHandler } from "../../../src/application/handlers/bet-won";
import { BetWon } from "../../../src/domain/events/bet-won";
import { InMemoryMartingaleRepository } from "../../../src/infra/repositories/in-memory-martingale";
import { BetBuilder } from "../../utils/builders/bet";

test("It should win a martingale when a bet is won", async () => {
  const martingaleRepository = new InMemoryMartingaleRepository();
  martingaleRepository.createDefaultMartingale();

  const bet = BetBuilder.aBet().withOutcome(100).build();
  const betWon = new BetWon(bet);
  const sut = new BetWonHandler({ martingaleRepository });
  await sut.handle(betWon);

  const martingale = await martingaleRepository.findById("default");
  expect(martingale.getBet()).toBe(10);
  expect(martingale.isFinished()).toBe(true);
});
