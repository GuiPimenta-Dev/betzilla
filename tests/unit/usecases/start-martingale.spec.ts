import { BetGatewayMock } from "../../utils/mocks/bet-gateway-mock";
import { BrokerSpy } from "../../utils/mocks/broker-spy";
import { InMemoryAccountRepository } from "../../../src/infra/repositories/in-memory-account";
import { InMemoryBroker } from "../../../src/infra/brokers/in-memory";
import { InMemoryMartingaleRepository } from "../../../src/infra/repositories/in-memory-martingale";
import { MakeBetHandler } from "../../../src/application/handlers/make-bet";
import { MakeMartingaleBetHandler } from "../../../src/application/handlers/make-martingale-bet";
import { MartingaleVerifiedHandler } from "../../../src/application/handlers/martingale-verified";
import { StartMartingale } from "../../../src/application/usecases/start-martingale";
import { VerifyMartingaleHandler } from "../../../src/application/handlers/verify-martingale";

test("It should be able to start martingale", async () => {
  const broker = new InMemoryBroker();
  const brokerSpy = new BrokerSpy(broker);
  const accountRepository = new InMemoryAccountRepository();
  accountRepository.createDefaultAccount();
  const martingaleRepository = new InMemoryMartingaleRepository();
  const betGateway = new BetGatewayMock();
  const handler1 = new MakeMartingaleBetHandler({ martingaleRepository, broker: brokerSpy });
  const handler2 = new MakeBetHandler({ accountRepository, betGateway, broker: brokerSpy });
  const handler3 = new VerifyMartingaleHandler({ betGateway, martingaleRepository, broker: brokerSpy });
  const handler4 = new MartingaleVerifiedHandler({ broker: brokerSpy });
  brokerSpy.register(handler1);
  brokerSpy.register(handler2);
  brokerSpy.register(handler3);
  brokerSpy.register(handler4);

  const sut = new StartMartingale({ broker: brokerSpy, martingaleRepository, accountRepository });
  const input = { accountId: "default", initialBet: 10, rounds: 1, multiplier: 2 };
  await sut.execute(input);

  await new Promise((res) => setTimeout(res, 0));
  expect(brokerSpy.events).toEqual(["bet-made", "martingale-verified", "martingale-finished"]);
  expect(brokerSpy.commands).toEqual(["make-martingale-bet", "make-bet", "make-martingale-bet"]);
  expect(brokerSpy.scheduledCommands).toEqual(["verify-martingale"]);
});
