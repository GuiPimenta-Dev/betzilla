import { BetMadeHandler } from "../../../src/application/handlers/bet-made";
import { BetMade } from "../../../src/domain/events/bet-made";
import { InMemoryBroker } from "../../../src/infra/brokers/in-memory";
import { InMemoryMartingaleRepository } from "../../../src/infra/repositories/in-memory-martingale";
import { BetBuilder } from "../../utils/builders/bet";
import { BrokerSpy } from "../../utils/mocks/broker-spy";

test("It should save an item in history when bet is made", async () => {
  const broker = new InMemoryBroker();
  const martingaleRepository = new InMemoryMartingaleRepository();
  martingaleRepository.createDefaultMartingale();

  const bet = BetBuilder.aBet().build();
  const betMade = new BetMade(bet);
  const sut = new BetMadeHandler({ martingaleRepository, broker });
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

test("It should schedule a command to verify the bet", async () => {
  const brokerSpy = new BrokerSpy(new InMemoryBroker());
  const martingaleRepository = new InMemoryMartingaleRepository();
  martingaleRepository.createDefaultMartingale();

  const bet = BetBuilder.aBet().build();
  const betMade = new BetMade(bet);
  const sut = new BetMadeHandler({ martingaleRepository, broker: brokerSpy });
  await sut.handle(betMade);

  expect(brokerSpy.scheduledCommands).toHaveLength(1);
  expect(brokerSpy.scheduledCommands[0].name).toBe("verify-bet");
  expect(brokerSpy.scheduledCommands[0].payload).toBe(bet);
});
