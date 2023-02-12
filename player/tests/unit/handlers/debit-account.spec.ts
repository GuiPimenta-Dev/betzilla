import { DebitAccountHandler } from "../../../src/application/handlers/debit-account";
import { BetLost } from "../../../src/domain/events/bet-lost";
import { InMemoryBroker } from "../../../src/infra/brokers/in-memory";
import { InMemoryPlayerRepository } from "../../../src/infra/repositories/in-memory-player";
import { BetBuilder } from "../../utils/builders/bet";
import { BrokerSpy } from "../../utils/mocks/broker-spy";

test("It should debit an account when receive an event bet lost", async () => {
  const broker = new InMemoryBroker();
  const playerRepository = new InMemoryPlayerRepository();
  playerRepository.createDefaultPlayer();

  const bet = BetBuilder.aBet().withValue(100).build();
  const betLost = new BetLost({ ...bet });
  const sut = new DebitAccountHandler({ playerRepository, broker });
  await sut.handle(betLost);

  const player = await playerRepository.findById("default");
  expect(player.account.balance).toBe(900);
});

test("It should emit an event debit made when receive an event bet lost", async () => {
  const playerRepository = new InMemoryPlayerRepository();
  const brokerSpy = new BrokerSpy(new InMemoryBroker());
  playerRepository.createDefaultPlayer();

  const bet = BetBuilder.aBet().build();
  const betLost = new BetLost({ ...bet });
  const sut = new DebitAccountHandler({ playerRepository, broker: brokerSpy });
  await sut.handle(betLost);

  expect(brokerSpy.events[0].name).toBe("debit-made");
  expect(brokerSpy.events[0].payload).toEqual(bet);
});

test("It should emit an event debit failed when receive an event bet lost and player does not has enough balance", async () => {
  const playerRepository = new InMemoryPlayerRepository();
  const brokerSpy = new BrokerSpy(new InMemoryBroker());
  playerRepository.createDefaultPlayer();

  const bet = BetBuilder.aBet().withValue(2000).build();
  const betLost = new BetLost({ ...bet });
  const sut = new DebitAccountHandler({ playerRepository, broker: brokerSpy });
  await sut.handle(betLost);

  expect(brokerSpy.events[0].name).toBe("debit-failed");
  expect(brokerSpy.events[0].payload).toEqual(bet);
});
