import { DebitFailedHandler } from "../../../src/application/handlers/debit-failed";
import { DebitFailed } from "../../../src/domain/events/debit-failed";
import { InMemoryBroker } from "../../../src/infra/brokers/in-memory";
import { BetBuilder } from "../../utils/builders/bet";
import { BrokerSpy } from "../../utils/mocks/broker-spy";

test("It should emit a martingale finished event if the debit failed", async () => {
  const brokerSpy = new BrokerSpy(new InMemoryBroker());

  const bet = BetBuilder.aBet().build();
  const sut = new DebitFailedHandler({ broker: brokerSpy });
  const debitFailed = new DebitFailed(bet);
  await sut.handle(debitFailed);

  expect(brokerSpy.events).toHaveLength(1);
  expect(brokerSpy.events[0].name).toBe("martingale-finished");
  expect(brokerSpy.events[0].payload).toEqual({ martingaleId: "default", reason: "not enough funds" });
});
