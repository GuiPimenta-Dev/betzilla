import { BetGatewayMock } from "../../utils/mocks/bet-gateway-mock";
import { BrokerSpy } from "../../utils/mocks/broker-spy";
import { CreditPlayerAccountHandler } from "../../../src/application/handlers/credit-player-account";
import { InMemoryBroker } from "../../../src/infra/brokers/in-memory";
import { InMemoryMartingaleRepository } from "../../../src/infra/repositories/in-memory-martingale";
import { InMemoryPlayerRepository } from "../../../src/infra/repositories/in-memory-player";
import { MailerSpy } from "../../utils/mocks/mailer-spy";
import { MakeBetHandler } from "../../../src/application/handlers/make-bet";
import { MakeMartingaleBetHandler } from "../../../src/application/handlers/make-martingale-bet";
import { MartingaleFinishedHandler } from "../../../src/application/handlers/martingale-finished";
import { MartingaleVerifiedHandler } from "../../../src/application/handlers/martingale-verified";
import { StartMartingale } from "../../../src/application/usecases/start-martingale";
import { VerifyMartingaleHandler } from "../../../src/application/handlers/verify-martingale";

test("It should emit the events in the correct order", async () => {
  const broker = new InMemoryBroker();
  const brokerSpy = new BrokerSpy(broker);
  const playerRepository = new InMemoryPlayerRepository();
  playerRepository.createDefaultPlayer();
  const martingaleRepository = new InMemoryMartingaleRepository();
  const betGateway = new BetGatewayMock();
  betGateway.mockVerifyBet([
    { status: "pending", amount: 0 },
    { status: "won", amount: 20 },
  ]);
  const handler1 = new MakeMartingaleBetHandler({ martingaleRepository, broker: brokerSpy });
  const handler2 = new MakeBetHandler({ playerRepository, betGateway, broker: brokerSpy });
  const handler3 = new VerifyMartingaleHandler({ betGateway, martingaleRepository, broker: brokerSpy });
  const handler4 = new MartingaleVerifiedHandler({ broker: brokerSpy });
  brokerSpy.register(handler1);
  brokerSpy.register(handler2);
  brokerSpy.register(handler3);
  brokerSpy.register(handler4);

  const sut = new StartMartingale({ broker: brokerSpy, martingaleRepository, playerRepository });
  const input = { playerId: "default", initialBet: 10, rounds: 1, multiplier: 2 };
  await sut.execute(input);

  await new Promise((res) => setTimeout(res));
  expect(brokerSpy.events).toHaveLength(4);
  expect(brokerSpy.commands).toHaveLength(4);
  expect(brokerSpy.scheduledCommands).toHaveLength(2);
  expect(brokerSpy.actions).toEqual([
    "make-martingale-bet",
    "make-bet",
    "bet-made",
    "verify-martingale",
    "martingale-verified",
    "verify-martingale",
    "credit-player-account",
    "martingale-verified",
    "make-martingale-bet",
    "martingale-finished",
  ]);
});

test("It should calculate the correct balance after martingale is finished", async () => {
  const broker = new InMemoryBroker();
  const playerRepository = new InMemoryPlayerRepository();
  playerRepository.createDefaultPlayer();
  const martingaleRepository = new InMemoryMartingaleRepository();
  const betGateway = new BetGatewayMock();
  betGateway.mockVerifyBet([
    { status: "lost", amount: 0 },
    { status: "lost", amount: 0 },
    { status: "won", amount: 70 },
    { status: "won", amount: 40 },
    { status: "lost", amount: 0 },
  ]);
  const handler1 = new MakeMartingaleBetHandler({ martingaleRepository, broker });
  const handler2 = new MakeBetHandler({ playerRepository, betGateway, broker });
  const handler3 = new VerifyMartingaleHandler({ betGateway, martingaleRepository, broker });
  const handler4 = new MartingaleVerifiedHandler({ broker });
  const handler5 = new CreditPlayerAccountHandler({ playerRepository });
  broker.register(handler1);
  broker.register(handler2);
  broker.register(handler3);
  broker.register(handler4);
  broker.register(handler5);

  const sut = new StartMartingale({ broker, martingaleRepository, playerRepository });
  const input = { playerId: "default", initialBet: 10, rounds: 5, multiplier: 2 };
  await sut.execute(input);

  await new Promise((res) => setTimeout(res));
  const player = await await playerRepository.findById("default");
  expect(player.account.getBalance()).toBe(1020);
});

test("It should send a report with all steps taken after martingale is finished", async () => {
  const broker = new InMemoryBroker();
  const playerRepository = new InMemoryPlayerRepository();
  playerRepository.createDefaultPlayer();
  const martingaleRepository = new InMemoryMartingaleRepository();
  const betGateway = new BetGatewayMock();
  betGateway.mockVerifyBet([
    { status: "lost", amount: 0 },
    { status: "won", amount: 100 },
    { status: "pending", amount: 0 },
    { status: "won", amount: 30 },
  ]);
  const mailer = new MailerSpy();
  const handler1 = new MakeMartingaleBetHandler({ martingaleRepository, broker });
  const handler2 = new MakeBetHandler({ playerRepository, betGateway, broker });
  const handler3 = new VerifyMartingaleHandler({ betGateway, martingaleRepository, broker });
  const handler4 = new MartingaleVerifiedHandler({ broker });
  const handler5 = new CreditPlayerAccountHandler({ playerRepository });
  const handler6 = new MartingaleFinishedHandler({ playerRepository, martingaleRepository, mailer });
  broker.register(handler1);
  broker.register(handler2);
  broker.register(handler3);
  broker.register(handler4);
  broker.register(handler5);
  broker.register(handler6);

  const sut = new StartMartingale({ broker, martingaleRepository, playerRepository });
  const input = { playerId: "default", initialBet: 10, rounds: 3, multiplier: 2 };
  await sut.execute(input);

  await new Promise((res) => setTimeout(res));
  expect(mailer.to).toBe("default@test.com");
  expect(mailer.subject).toBe("Martingale Finished");
  expect(mailer.body).toBeDefined();
});
