import { MakeMartingaleBetHandler } from "../../../src/application/handlers/make-martingale-bet";
import { MakeMartingaleBet } from "../../../src/domain/commands/make-martingale-bet";
import { Bet } from "../../../src/domain/entities/bet";
import { InMemoryBroker } from "../../../src/infra/brokers/in-memory";
import { InMemoryMartingaleRepository } from "../../../src/infra/repositories/in-memory-martingale";
import { BrokerSpy } from "../../utils/mocks/broker-spy";

test("It should emit a make bet command and schedule a verify bet command", async () => {
  const brokerSpy = new BrokerSpy(new InMemoryBroker());
  const martingaleRepository = new InMemoryMartingaleRepository();
  martingaleRepository.createDefaultMartingale();

  const sut = new MakeMartingaleBetHandler({ broker: brokerSpy, martingaleRepository });
  const makeMartingaleBet = new MakeMartingaleBet({ martingaleId: "default" });
  await sut.handle(makeMartingaleBet);

  expect(brokerSpy.commands).toHaveLength(1);
  expect(brokerSpy.commands[0].name).toBe("make-bet");
  expect(brokerSpy.commands[0].payload).toBeInstanceOf(Bet);
  expect(brokerSpy.scheduledCommands).toHaveLength(1);
  expect(brokerSpy.scheduledCommands[0].name).toBe("verify-bet");
  expect(brokerSpy.scheduledCommands[0].payload).toBeInstanceOf(Bet);
});
