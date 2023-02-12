import { UpdateHistoryOnBetLostHandler } from "../../../src/application/handlers/update-history-on-bet-lost";
import { BetLost } from "../../../src/domain/events/bet-lost";
import { InMemoryMartingaleRepository } from "../../../src/infra/repositories/in-memory-martingale";
import { BetBuilder } from "../../utils/builders/bet";
import { HistoryItemBuilder } from "../../utils/builders/history-item";

test("It should update the history when a bet is lost", async () => {
  const martingaleRepository = new InMemoryMartingaleRepository();
  const bet = BetBuilder.aBet().build();
  const pending = HistoryItemBuilder.aPending().withBetId(bet.id).build();
  martingaleRepository.createHistoryItem(pending);

  const betLost = new BetLost(bet);
  const sut = new UpdateHistoryOnBetLostHandler({ martingaleRepository });
  await sut.handle(betLost);

  const history = await martingaleRepository.findHistory("default");
  expect(history).toEqual([
    {
      betId: bet.id,
      martingaleId: "default",
      winner: false,
      investiment: 10,
      outcome: 0,
      profit: -10,
    },
  ]);
});
