import { StartOver05HT } from "../../../src/application/usecases/start-over-05-ht";
import { InMemoryBroker } from "../../../src/infra/brokers/in-memory";
import { InMemoryRuleRepository } from "../../../src/infra/repositories/in-memory-rule";
import { BrokerSpy } from "../../utils/mocks/broker-spy";

test("It should emit a over 0.5 HT started event", async () => {
  const brokerSpy = new BrokerSpy(new InMemoryBroker());
  const ruleRepository = new InMemoryRuleRepository();
  const sut = new StartOver05HT({ broker: brokerSpy, ruleRepository });

  const input = { id: "id", rule: "over-05-ht", playerId: "playerId", value: 10 };
  await sut.execute(input);

  expect(brokerSpy.events).toHaveLength(1);
});

test("It should create a strategy", async () => {
  const brokerSpy = new BrokerSpy(new InMemoryBroker());
  const ruleRepository = new InMemoryRuleRepository();
  const sut = new StartOver05HT({ broker: brokerSpy, ruleRepository });

  const input = { rule: "over-05-ht||under-25-ft", playerId: "playerId", value: 10 };
  const { ruleId } = await sut.execute(input);

  expect(await ruleRepository.findById(ruleId)).toEqual({
    id: ruleId,
    playerId: "playerId",
    string: "over-05-ht||under-25-ft",
    value: 10,
  });
});
