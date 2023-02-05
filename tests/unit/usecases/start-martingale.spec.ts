import { BetGatewayMock } from "../../utils/mocks/bet-gateway-mock";
import { BrokerSpy } from "../../utils/mocks/broker-spy";
import { CreditAccountHandler } from "../../../src/application/handlers/credit-account";
import { InMemoryAccountRepository } from "../../../src/infra/repositories/in-memory-account";
import { InMemoryBroker } from "../../../src/infra/brokers/in-memory";
import { InMemoryMartingaleRepository } from "../../../src/infra/repositories/in-memory-martingale";
import { MakeBetHandler } from "../../../src/application/handlers/make-bet";
import { MakeMartingaleBetHandler } from "../../../src/application/handlers/make-martingale-bet";
import { MartingaleVerifiedHandler } from "../../../src/application/handlers/martingale-verified";
import { StartMartingale } from "../../../src/application/usecases/start-martingale";
import { VerifyMartingaleHandler } from "../../../src/application/handlers/verify-martingale";

test("It should emit the events in the correct order", async () => {
  const broker = new InMemoryBroker();
  const brokerSpy = new BrokerSpy(broker);
  const accountRepository = new InMemoryAccountRepository();
  accountRepository.createDefaultAccount();
  const martingaleRepository = new InMemoryMartingaleRepository();
  const betGateway = new BetGatewayMock();
  betGateway.mockVerifyBet([{ status: "won", amount: 20 }]);
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

  await new Promise((res) => setTimeout(res, 100));
  expect(brokerSpy.events).toHaveLength(3);
  expect(brokerSpy.commands).toHaveLength(4);
  expect(brokerSpy.scheduledCommands).toHaveLength(1);
  expect(brokerSpy.actions).toEqual([
    "make-martingale-bet",
    "make-bet",
    "bet-made",
    "verify-martingale",
    "credit-account",
    "martingale-verified",
    "make-martingale-bet",
    "martingale-finished",
  ]);
});

test("It should calculate the correct balance after a whole flow", async () => {
  const broker = new InMemoryBroker();
  const brokerSpy = new BrokerSpy(broker);
  const accountRepository = new InMemoryAccountRepository();
  accountRepository.createDefaultAccount();
  const martingaleRepository = new InMemoryMartingaleRepository();
  const betGateway = new BetGatewayMock();
  betGateway.mockVerifyBet([
    { status: "lost", amount: 0 },
    { status: "lost", amount: 0 },
    { status: "won", amount: 70 },
    { status: "won", amount: 40 },
    { status: "lost", amount: 0 },
  ]);
  const handler1 = new MakeMartingaleBetHandler({ martingaleRepository, broker: brokerSpy });
  const handler2 = new MakeBetHandler({ accountRepository, betGateway, broker: brokerSpy });
  const handler3 = new VerifyMartingaleHandler({ betGateway, martingaleRepository, broker: brokerSpy });
  const handler4 = new MartingaleVerifiedHandler({ broker: brokerSpy });
  const handler5 = new CreditAccountHandler({ accountRepository });
  brokerSpy.register(handler1);
  brokerSpy.register(handler2);
  brokerSpy.register(handler3);
  brokerSpy.register(handler4);
  brokerSpy.register(handler5);

  const sut = new StartMartingale({ broker: brokerSpy, martingaleRepository, accountRepository });
  const input = { accountId: "default", initialBet: 10, rounds: 5, multiplier: 2 };
  await sut.execute(input);

  await new Promise((res) => setTimeout(res, 0));
  const balance = await (await accountRepository.findById("default")).getBalance();
  expect(balance).toBe(1020);
});
