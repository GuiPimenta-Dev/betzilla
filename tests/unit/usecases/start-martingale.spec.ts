import { CreditPlayerAccountHandler } from "../../../src/application/handlers/credit-player-account";
import { DebitPlayerAccountHandler } from "../../../src/application/handlers/debit-player-account";
import { MakeBetHandler } from "../../../src/application/handlers/make-bet";
import { MakeMartingaleBetHandler } from "../../../src/application/handlers/make-martingale-bet";
import { MartingaleFinishedHandler } from "../../../src/application/handlers/martingale-finished";
import { MartingaleVerifiedHandler } from "../../../src/application/handlers/martingale-verified";
import { VerifyMartingaleHandler } from "../../../src/application/handlers/verify-martingale";
import { StartMartingale } from "../../../src/application/usecases/start-martingale";
import { InMemoryBroker } from "../../../src/infra/brokers/in-memory";
import { InMemoryMartingaleRepository } from "../../../src/infra/repositories/in-memory-martingale";
import { InMemoryPlayerRepository } from "../../../src/infra/repositories/in-memory-player";
import { BetGatewayMock } from "../../utils/mocks/bet-gateway-mock";
import { BrokerSpy } from "../../utils/mocks/broker-spy";
import { MailerSpy } from "../../utils/mocks/mailer-spy";

let brokerSpy: BrokerSpy;
let playerRepository: InMemoryPlayerRepository;
let martingaleRepository: InMemoryMartingaleRepository;
let betGatewayMock: BetGatewayMock;
let mailerSpy: MailerSpy;

beforeEach(() => {
  brokerSpy = new BrokerSpy(new InMemoryBroker());
  martingaleRepository = new InMemoryMartingaleRepository();
  playerRepository = new InMemoryPlayerRepository();
  betGatewayMock = new BetGatewayMock();
  mailerSpy = new MailerSpy();
  const handlers = [
    new MakeMartingaleBetHandler({ broker: brokerSpy, martingaleRepository }),
    new MakeBetHandler({ broker: brokerSpy, betGateway: betGatewayMock }),
    new DebitPlayerAccountHandler({ broker: brokerSpy, playerRepository }),
    new VerifyMartingaleHandler({ broker: brokerSpy, martingaleRepository, betGateway: betGatewayMock }),
    new MartingaleVerifiedHandler({ broker: brokerSpy, martingaleRepository }),
    new MartingaleFinishedHandler({ playerRepository, martingaleRepository, mailer: mailerSpy }),
    new CreditPlayerAccountHandler({ broker: brokerSpy, playerRepository }),
  ];
  handlers.forEach((handler) => brokerSpy.register(handler));
});

test("It should emit all the events in the correct order", async () => {
  playerRepository.createDefaultPlayer();
  betGatewayMock.mockConsultBetResponse([
    { status: "pending", amount: 0 },
    { status: "won", amount: 20 },
  ]);

  const sut = new StartMartingale({ broker: brokerSpy, martingaleRepository, playerRepository });
  const input = { playerId: "default", initialBet: 10, rounds: 1, multiplier: 2 };
  await sut.execute(input);

  await new Promise((res) => setTimeout(res));
  expect(brokerSpy.events).toHaveLength(5);
  expect(brokerSpy.commands).toHaveLength(4);
  expect(brokerSpy.scheduledCommands).toHaveLength(2);
  expect(brokerSpy.actions).toEqual([
    "make-martingale-bet",
    "make-bet",
    "debit-player-account",
    "debit-made",
    "verify-martingale",
    "martingale-verified",
    "verify-martingale",
    "credit-player-account",
    "credit-made",
    "martingale-verified",
    "martingale-finished",
  ]);
});

test("It should calculate the correct balance and history after martingale is finished", async () => {
  playerRepository.createDefaultPlayer();
  betGatewayMock.mockConsultBetResponse([
    { status: "lost", amount: 0 },
    { status: "lost", amount: 0 },
    { status: "won", amount: 70 },
    { status: "won", amount: 40 },
    { status: "lost", amount: 0 },
  ]);

  const sut = new StartMartingale({ broker: brokerSpy, martingaleRepository, playerRepository });
  const input = { playerId: "default", initialBet: 10, rounds: 5, multiplier: 2 };
  const { martingaleId } = await sut.execute(input);

  await new Promise((res) => setTimeout(res));
  const player = await playerRepository.findById("default");
  const history = await martingaleRepository.findHistory(martingaleId);
  expect(player.account.getBalance()).toBe(1020);
  expect(history).toHaveLength(5);
  expect(history[0]).toMatchObject({ winner: false, investiment: 10, outcome: 0, profit: -10 });
  expect(history[1]).toMatchObject({ winner: false, investiment: 20, outcome: 0, profit: -20 });
  expect(history[2]).toMatchObject({ winner: true, investiment: 40, outcome: 70, profit: 30 });
  expect(history[3]).toMatchObject({ winner: true, investiment: 10, outcome: 40, profit: 30 });
  expect(history[4]).toMatchObject({ winner: false, investiment: 10, outcome: 0, profit: -10 });
});

test("It should send a report after martingale is finished", async () => {
  playerRepository.createDefaultPlayer();

  const sut = new StartMartingale({ broker: brokerSpy, martingaleRepository, playerRepository });
  const input = { playerId: "default", initialBet: 10, rounds: 1, multiplier: 2 };
  await sut.execute(input);

  await new Promise((res) => setTimeout(res));
  expect(mailerSpy.to).toBe("default@test.com");
  expect(mailerSpy.subject).toBe("Martingale Finished");
  expect(mailerSpy.body).toBeDefined();
});

test("It should throw an error if there isnt at least one round", async () => {
  playerRepository.createDefaultPlayer();

  const sut = new StartMartingale({ broker: brokerSpy, martingaleRepository, playerRepository });
  const input = { playerId: "default", initialBet: 10, rounds: 0, multiplier: 2 };
  await expect(sut.execute(input)).rejects.toThrow("There must be at least one round");
});

test("It should throw an error if user does not have enough balance", async () => {
  playerRepository.createDefaultPlayer();

  const sut = new StartMartingale({ broker: brokerSpy, martingaleRepository, playerRepository });
  const input = { playerId: "default", initialBet: 2000, rounds: 1, multiplier: 2 };
  await expect(sut.execute(input)).rejects.toThrow("Insufficient Funds");
});
