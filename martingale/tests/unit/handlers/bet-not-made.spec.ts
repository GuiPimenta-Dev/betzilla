import { BetNotMadeHandler } from "../../../src/application/handlers/bet-not-made";
import { BetNotMade } from "../../../src/domain/events/bet-not-made";
import { InMemoryBroker } from "../../../src/infra/brokers/in-memory";
import { BetBuilder } from "../../utils/builders/bet";
import { BrokerSpy } from "../../utils/mocks/broker-spy";

test("It should schedule a command to make the same bet again", async () => {
  const brokerSpy = new BrokerSpy(new InMemoryBroker());

  const bet = BetBuilder.aBet().build();
  const betNotMade = new BetNotMade(bet);
  const sut = new BetNotMadeHandler({ broker: brokerSpy });
  await sut.handle(betNotMade);

  expect(brokerSpy.scheduledCommands).toHaveLength(1);
  expect(brokerSpy.scheduledCommands[0].name).toBe("make-bet");
  expect(brokerSpy.scheduledCommands[0].payload).toBe(bet);
});

test("It should increase in one the attempts of the bet", async () => {
  const brokerSpy = new BrokerSpy(new InMemoryBroker());

  const bet = BetBuilder.aBet().build();
  const betNotMade = new BetNotMade(bet);
  const sut = new BetNotMadeHandler({ broker: brokerSpy });
  await sut.handle(betNotMade);

  expect(brokerSpy.scheduledCommands[0].payload.attempts).toBe(1);
});

test("It should emit a martingale finished event if the bet was not made 3 times", async () => {
  const brokerSpy = new BrokerSpy(new InMemoryBroker());
  const bet = BetBuilder.aBet().build();
  bet.retry();
  bet.retry();
  bet.retry();

  const betNotMade = new BetNotMade(bet);
  const sut = new BetNotMadeHandler({ broker: brokerSpy });
  await sut.handle(betNotMade);

  expect(brokerSpy.events).toHaveLength(1);
  expect(brokerSpy.events[0].name).toBe("martingale-finished");
  expect(brokerSpy.events[0].payload).toEqual({ martingaleId: "default", status: "max attempts reached" });
});

test("It should not emit a martingale finished event if the bet was not made less than 3 times", async () => {
  const brokerSpy = new BrokerSpy(new InMemoryBroker());
  const bet = BetBuilder.aBet().build();

  const betNotMade = new BetNotMade(bet);
  const sut = new BetNotMadeHandler({ broker: brokerSpy });
  await sut.handle(betNotMade);

  expect(brokerSpy.events).toHaveLength(0);
});

test("It should not schedule a command to make the same bet again if the max attempts is reached", async () => {
  const brokerSpy = new BrokerSpy(new InMemoryBroker());
  const bet = BetBuilder.aBet().build();
  bet.retry();
  bet.retry();
  bet.retry();

  const betNotMade = new BetNotMade(bet);
  const sut = new BetNotMadeHandler({ broker: brokerSpy });
  await sut.handle(betNotMade);

  expect(brokerSpy.scheduledCommands).toHaveLength(0);
});
