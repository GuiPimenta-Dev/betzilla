import { CreateBot } from "../../../src/application/usecases/create-bot";
import { InMemoryBroker } from "../../../src/infra/brokers/in-memory";
import { InMemoryBotRepository } from "../../../src/infra/repositories/in-memory-bot";
import { BrokerSpy } from "../../utils/mocks/broker-spy";

test("It should emit a over 0.5 HT started event", async () => {
  const brokerSpy = new BrokerSpy(new InMemoryBroker());
  const botRepository = new InMemoryBotRepository();
  const sut = new CreateBot({ broker: brokerSpy, botRepository });

  const bot = {
    name: "player-rules",
    market: "OVER_UNDER_05",
    side: "back",
    betValue: 10,
    conditions: [
      {
        name: "IS_AFTER_MINUTE",
        value: 15,
      },
      {
        name: "IS_ODD_ABOVE",
        value: 1.5,
      },
      {
        name: "IS_HALF_TIME",
      },
    ],
  };
  const input = { bot, playerId: "playerId" };
  await sut.execute(input);

  expect(brokerSpy.events).toHaveLength(1);
});

test("It should create a bot", async () => {
  const brokerSpy = new BrokerSpy(new InMemoryBroker());
  const botRepository = new InMemoryBotRepository();
  const sut = new CreateBot({ broker: brokerSpy, botRepository: botRepository });

  const bot = {
    name: "player-rules",
    market: "OVER_UNDER_05",
    side: "back",
    betValue: 10,
    conditions: [
      {
        name: "IS_AFTER_MINUTE",
        value: 15,
      },
      {
        name: "IS_ODD_ABOVE",
        value: 1.5,
      },
      {
        name: "IS_HALF_TIME",
      },
    ],
  };
  const input = { bot, playerId: "playerId" };
  const { botId } = await sut.execute(input);

  const _bot = await botRepository.findById(botId);
  expect(_bot.id).toBe(botId);
  expect(_bot.betValue).toBe(10);
  expect(_bot.conditions).toHaveLength(3);
});
