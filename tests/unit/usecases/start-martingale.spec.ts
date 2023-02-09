import { BetLostHandler } from "../../../src/application/handlers/martingale/bet-lost";
import { BetMadeHandler } from "../../../src/application/handlers/martingale/bet-made";
import { BetVerifiedHandler } from "../../../src/application/handlers/martingale/bet-verified";
import { BetWonHandler } from "../../../src/application/handlers/martingale/bet-won";
import { MakeMartingaleBetHandler } from "../../../src/application/handlers/martingale/make-martingale-bet";
import { MartingaleFinishedHandler } from "../../../src/application/handlers/martingale/martingale-finished";
import { UpdateHistoryOnBetLostHandler } from "../../../src/application/handlers/martingale/update-history-on-bet-lost";
import { UpdateHistoryOnBetWonHandler } from "../../../src/application/handlers/martingale/update-history-on-bet-won";
import { CreditAccountHandler } from "../../../src/application/handlers/player/credit-account";
import { DebitAccountHandler } from "../../../src/application/handlers/player/debit-account";
import { MakeBetHandler } from "../../../src/application/handlers/player/make-bet";
import { VerifyBetHandler } from "../../../src/application/handlers/player/verify-bet";
import { StartMartingale } from "../../../src/application/usecases/martingale/start-martingale";
import { InMemoryBroker } from "../../../src/infra/brokers/in-memory";
import { InMemoryMartingaleRepository } from "../../../src/infra/repositories/in-memory-martingale";
import { InMemoryPlayerRepository } from "../../../src/infra/repositories/in-memory-player";
import { BetGatewayMock } from "../../utils/mocks/bet-gateway-mock";
import { BrokerSpy } from "../../utils/mocks/broker-spy";
import { MailerSpy } from "../../utils/mocks/mailer-spy";
import { MartingaleRepositorySpy } from "../../utils/mocks/martingale-repository-spy";

let brokerSpy: BrokerSpy;
let playerRepository: InMemoryPlayerRepository;
let martingaleRepository: InMemoryMartingaleRepository;
let martingaleRepositorySpy: MartingaleRepositorySpy;
let betGatewayMock: BetGatewayMock;
let mailerSpy: MailerSpy;

beforeEach(() => {
  brokerSpy = new BrokerSpy(new InMemoryBroker());
  martingaleRepository = new InMemoryMartingaleRepository();
  martingaleRepositorySpy = new MartingaleRepositorySpy(martingaleRepository);
  playerRepository = new InMemoryPlayerRepository();
  playerRepository.createDefaultPlayer();
  betGatewayMock = new BetGatewayMock();
  mailerSpy = new MailerSpy();
  const handlers = [
    new MakeMartingaleBetHandler({ broker: brokerSpy, martingaleRepository }),
    new MakeBetHandler({ broker: brokerSpy, betGateway: betGatewayMock, playerRepository }),
    new BetMadeHandler({ martingaleRepository: martingaleRepositorySpy }),
    new BetWonHandler({ martingaleRepository }),
    new BetLostHandler({ martingaleRepository }),
    new UpdateHistoryOnBetLostHandler({ martingaleRepository: martingaleRepositorySpy }),
    new UpdateHistoryOnBetWonHandler({ martingaleRepository: martingaleRepositorySpy }),
    new DebitAccountHandler({ broker: brokerSpy, playerRepository }),
    new VerifyBetHandler({ broker: brokerSpy, betGateway: betGatewayMock }),
    new BetVerifiedHandler({ broker: brokerSpy, martingaleRepository }),
    new MartingaleFinishedHandler({ playerRepository, martingaleRepository, mailer: mailerSpy }),
    new CreditAccountHandler({ broker: brokerSpy, playerRepository }),
  ];
  handlers.forEach((handler) => brokerSpy.register(handler));
});

test("It should emit all the events in the correct order", async () => {
  playerRepository.createDefaultPlayer();
  betGatewayMock.mockConsultBetResponse([
    { status: "pending", amount: 0 },
    { status: "lost", amount: 0 },
    { status: "won", amount: 20 },
  ]);

  const sut = new StartMartingale({ broker: brokerSpy, martingaleRepository });
  const input = { playerId: "default", initialBet: 10, rounds: 2, multiplier: 2 };
  await sut.execute(input);

  await new Promise((res) => setTimeout(res));
  expect(brokerSpy.events).toHaveLength(10);
  expect(brokerSpy.commands).toHaveLength(4);
  expect(brokerSpy.scheduledCommands).toHaveLength(3);
  expect(brokerSpy.history).toEqual([
    "make-martingale-bet",
    "make-bet",
    "verify-bet",
    "bet-made",
    "verify-bet",
    "bet-lost",
    "debit-made",
    "bet-verified",
    "make-martingale-bet",
    "make-bet",
    "verify-bet",
    "bet-made",
    "bet-won",
    "debit-made",
    "credit-made",
    "bet-verified",
    "martingale-finished",
  ]);
});

test("It should calculate the correct balance and history after martingale is finished", async () => {
  betGatewayMock.mockConsultBetResponse([
    { status: "lost", amount: 0 },
    { status: "lost", amount: 0 },
    { status: "won", amount: 70 },
    { status: "won", amount: 40 },
    { status: "lost", amount: 0 },
  ]);

  const sut = new StartMartingale({ broker: brokerSpy, martingaleRepository });
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

test("It should update a pending bet in history", async () => {
  betGatewayMock.mockConsultBetResponse([
    { status: "pending", amount: 0 },
    { status: "won", amount: 20 },
  ]);

  const sut = new StartMartingale({ broker: brokerSpy, martingaleRepository });
  const input = { playerId: "default", initialBet: 10, rounds: 1, multiplier: 2 };
  const { martingaleId } = await sut.execute(input);

  await new Promise((res) => setTimeout(res));
  const history = await martingaleRepository.findHistory(martingaleId);
  const { itemSaved, itemUpdated } = martingaleRepositorySpy;
  expect(history).toHaveLength(1);
  expect(history[0]).toMatchObject({ winner: true, investiment: 10, outcome: 20, profit: 10 });
  expect(itemSaved).toMatchObject({ winner: "pending", investiment: 10 });
  expect(itemUpdated).toMatchObject({ winner: true, outcome: 20, profit: 10 });
  expect(itemSaved.itemId).toBe(itemUpdated.itemId);
});

test("It should send a report after martingale is finished", async () => {
  playerRepository.createDefaultPlayer();

  const sut = new StartMartingale({ broker: brokerSpy, martingaleRepository });
  const input = { playerId: "default", initialBet: 10, rounds: 1, multiplier: 2 };
  await sut.execute(input);

  await new Promise((res) => setTimeout(res));
  expect(mailerSpy.to).toBe("default@test.com");
  expect(mailerSpy.subject).toBe("Martingale Finished");
  expect(mailerSpy.body).toBeDefined();
});

test("It should throw an error if there isnt at least one round", async () => {
  playerRepository.createDefaultPlayer();

  const sut = new StartMartingale({ broker: brokerSpy, martingaleRepository });
  const input = { playerId: "default", initialBet: 10, rounds: 0, multiplier: 2 };
  await expect(sut.execute(input)).rejects.toThrow("There must be at least one round");
});
