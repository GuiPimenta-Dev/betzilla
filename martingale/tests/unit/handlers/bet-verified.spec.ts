import { BetVerifiedHandler } from "../../../src/application/handlers/bet-verified";
import { Martingale } from "../../../src/domain/entities/martingale";
import { BetVerified } from "../../../src/domain/events/bet-verified";
import { InMemoryBroker } from "../../../src/infra/brokers/in-memory";
import { InMemoryMartingaleRepository } from "../../../src/infra/repositories/in-memory-martingale";
import { BetBuilder } from "../../utils/builders/bet";
import { BrokerSpy } from "../../utils/mocks/broker-spy";

test("It should emit a make martingale bet command when martingale is not finished", async () => {
  const brokerSpy = new BrokerSpy(new InMemoryBroker());
  const martingaleRepository = new InMemoryMartingaleRepository();
  martingaleRepository.createDefaultMartingale();

  const bet = BetBuilder.aBet().build();
  const betVerified = new BetVerified(bet);
  const sut = new BetVerifiedHandler({ broker: brokerSpy, martingaleRepository });
  await sut.handle(betVerified);

  expect(brokerSpy.events.length).toBe(0);
  expect(brokerSpy.commands.length).toBe(1);
  expect(brokerSpy.commands[0].name).toBe("make-martingale-bet");
  expect(brokerSpy.commands[0].payload).toEqual({ martingaleId: "default" });
});

test("It should emit a martingale finished event when a martingale is finished", async () => {
  const brokerSpy = new BrokerSpy(new InMemoryBroker());
  const martingaleRepository = new InMemoryMartingaleRepository();
  const settings = { id: "default", playerId: "default", initialBet: 10, rounds: 0, multiplier: 2 };
  martingaleRepository.create(new Martingale(settings));

  const bet = BetBuilder.aBet().build();
  const betVerified = new BetVerified(bet);
  const sut = new BetVerifiedHandler({ broker: brokerSpy, martingaleRepository });
  await sut.handle(betVerified);

  expect(brokerSpy.commands.length).toBe(0);
  expect(brokerSpy.events.length).toBe(1);
  expect(brokerSpy.events[0].name).toBe("martingale-finished");
  expect(brokerSpy.events[0].payload).toEqual({ martingaleId: "default", reason: "finished" });
});
