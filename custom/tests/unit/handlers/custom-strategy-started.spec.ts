import { CustomStrategyStartedHandler } from "../../../src/application/handlers/custom-strategy-started";
import { CustomStrategyStarted } from "../../../src/domain/events/custom-strategy-started";
import { InMemoryBroker } from "../../../src/infra/brokers/in-memory";
import { RabbitMQAdapter } from "../../../src/infra/brokers/rabbitmq-adapter";
import { BrokerSpy } from "../../utils/mocks/broker-spy";
import { HttpClientStub } from "../../utils/mocks/http-client-stub";

test("It should start a custom strategy", async () => {
  const brokerSpy = new BrokerSpy(new InMemoryBroker());
  const httpClientStub = new HttpClientStub();
  httpClientStub.mockGetResponse({
    statusCode: 200,
    data: [
      { id: "1", name: "Real Madrid vs Barcelona", date: "2021-01-01T23:59:00.000Z" },
      { id: "2", name: "Roma vs PSG", date: "2021-01-01T23:59:00.000Z" },
      { id: "3", name: "Bayern de Munique vs Liverpool", date: "2021-01-01T23:59:00.000Z" },
    ],
  });

  const input = { id: "1", playerId: "1", strategyString: "over-05-ht" };
  const event = new CustomStrategyStarted(input);
  const sut = new CustomStrategyStartedHandler(httpClientStub, brokerSpy);
  await sut.handle(event);

  expect(brokerSpy.scheduledCommands).toHaveLength(3);
  expect(brokerSpy.history).toEqual(["verify-odds", "verify-odds", "verify-odds"]);
});

test("It should schedule a message on rabbitmq", async () => {
  const broker = new RabbitMQAdapter();
  const httpClientStub = new HttpClientStub();
  httpClientStub.mockGetResponse({
    statusCode: 200,
    data: [
      { id: "1", name: "Real Madrid vs Barcelona", date: "2021-01-01T23:59:00.000Z" },
      { id: "2", name: "Roma vs PSG", date: "2021-01-01T23:59:00.000Z" },
      { id: "3", name: "Bayern de Munique vs Liverpool", date: "2021-01-01T23:59:00.000Z" },
    ],
  });

  const input = { id: "1", playerId: "1", strategyString: "over-05-ht" };
  const event = new CustomStrategyStarted(input);
  const sut = new CustomStrategyStartedHandler(httpClientStub, broker);
  await sut.handle(event);
});
