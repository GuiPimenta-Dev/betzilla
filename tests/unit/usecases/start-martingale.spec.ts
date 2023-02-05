import { BetGatewayMock } from "../../utils/mocks/bet-gateway-mock";
import { BrokerSpy } from "../../utils/mocks/broker-spy";
import { InMemoryAccountRepository } from "../../../src/infra/repositories/in-memory-account";
import { InMemoryBroker } from "../../../src/infra/brokers/in-memory";
import { InMemoryMartingaleRepository } from "../../../src/infra/repositories/in-memory-martingale";
import { MakeBetHandler } from "../../../src/application/handlers/make-bet";
import { MakeMartingaleBetHandler } from "../../../src/application/handlers/make-martingale-bet";
import { StartMartingale } from "../../../src/application/usecases/start-martingale";

test("It should be able to start martingale", async () => {
  const broker = new InMemoryBroker();
  const brokerSpy = new BrokerSpy(broker);
  const accountRepository = new InMemoryAccountRepository();
  accountRepository.createDefaultAccount();
  const martingaleRepository = new InMemoryMartingaleRepository();
  const betGateway = new BetGatewayMock();
  const handler1 = new MakeMartingaleBetHandler({ martingaleRepository, broker: brokerSpy });
  const handler2 = new MakeBetHandler({ accountRepository, betGateway, broker: brokerSpy });
  brokerSpy.register(handler1);
  brokerSpy.register(handler2);

  const sut = new StartMartingale({ broker: brokerSpy, martingaleRepository, accountRepository });
  const input = { accountId: "default", initialBet: 10, rounds: 10, multiplier: 2 };
  await sut.execute(input);

  const balance = await (await accountRepository.findById("default")).getBalance();
  expect(balance).toBe(990);
  expect(brokerSpy.events.length).toBe(1);
  expect(brokerSpy.commands.length).toBe(2);
  expect(brokerSpy.commands[0].name).toBe("make-martingale-bet");
  expect(brokerSpy.commands[1].name).toBe("make-bet");
  expect(brokerSpy.events[0].name).toBe("bet-made");
});
