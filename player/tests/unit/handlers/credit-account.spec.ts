import { CreditAccountHandler } from "../../../src/application/handlers/credit-account";
import { BetWon } from "../../../src/domain/events/bet-won";
import { InMemoryBroker } from "../../../src/infra/brokers/in-memory";
import { InMemoryPlayerRepository } from "../../../src/infra/repositories/in-memory-player";
import { BrokerSpy } from "../../utils/mocks/broker-spy";

const bet = { betId: "betId", playerId: "default", outcome: 100 };

test("It should credit an account when receive an event bet won", async () => {
  const broker = new InMemoryBroker();
  const playerRepository = new InMemoryPlayerRepository();
  await playerRepository.createDefaultPlayer();

  const betWon = new BetWon(bet);
  const sut = new CreditAccountHandler({ playerRepository, broker });
  await sut.handle(betWon);

  const player = await playerRepository.findById("default");
  expect(player.account.balance).toBe(1100);
});

test("It should emit an event credit made when receive an event bet won", async () => {
  const playerRepository = new InMemoryPlayerRepository();
  const brokerSpy = new BrokerSpy(new InMemoryBroker());
  await playerRepository.createDefaultPlayer();

  const betWon = new BetWon(bet);
  const sut = new CreditAccountHandler({ playerRepository, broker: brokerSpy });
  await sut.handle(betWon);

  expect(brokerSpy.events[0].name).toBe("credit-made");
  expect(brokerSpy.events[0].payload).toMatchObject({ ...bet, credit: 100 });
});
