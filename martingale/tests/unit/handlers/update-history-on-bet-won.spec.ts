import { UpdateHistoryOnBetWonHandler } from "../../../src/application/handlers/update-history-on-bet-won";
import { BetWon } from "../../../src/domain/events/bet-won";
import { InMemoryMartingaleRepository } from "../../../src/infra/repositories/in-memory-martingale";
import { BetBuilder } from "../../utils/builders/bet";
import { HistoryItemBuilder } from "../../utils/builders/history-item";

test("It should update the history when a bet is won", async () => {
  const martingaleRepository = new InMemoryMartingaleRepository();
  const bet = BetBuilder.aBet().build();
  const pending = HistoryItemBuilder.aPending().withBetId(bet.id).build();
  martingaleRepository.createHistoryItem(pending);

  const betWon = new BetWon({ ...bet, outcome: 100 });
  const sut = new UpdateHistoryOnBetWonHandler({ martingaleRepository });
  await sut.handle(betWon);

  const history = await martingaleRepository.findHistory("default");
  expect(history).toEqual([
    {
      betId: bet.id,
      martingaleId: "default",
      winner: true,
      investiment: 10,
      outcome: 100,
      profit: 90,
    },
  ]);
});
