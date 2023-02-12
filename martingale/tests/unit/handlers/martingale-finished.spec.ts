import { MartingaleFinishedHandler } from "../../../src/application/handlers/martingale-finished";
import { MartingaleFinished } from "../../../src/domain/events/martingale-finished";
import { InMemoryBroker } from "../../../src/infra/brokers/in-memory";
import { InMemoryMartingaleRepository } from "../../../src/infra/repositories/in-memory-martingale";
import { BrokerSpy } from "../../utils/mocks/broker-spy";

test("It should emit a send email command when martingale is finished", async () => {
  const brokerSpy = new BrokerSpy(new InMemoryBroker());
  const martingaleRepository = new InMemoryMartingaleRepository();
  martingaleRepository.createDefaultMartingale();

  const sut = new MartingaleFinishedHandler({ broker: brokerSpy, martingaleRepository });
  const martingaleFinished = new MartingaleFinished({ martingaleId: "default", reason: "finished" });
  await sut.handle(martingaleFinished);

  expect(brokerSpy.commands).toHaveLength(1);
  expect(brokerSpy.commands[0].name).toBe("send-email");
  expect(brokerSpy.commands[0].payload.playerId).toBe("default");
  expect(brokerSpy.commands[0].payload.subject).toBe("Martingale Finished");
  expect(brokerSpy.commands[0].payload.body).toBe('{"history":[],"balance":0,"reason":"finished"}');
});
