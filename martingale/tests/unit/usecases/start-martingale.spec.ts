import { BetLostHandler } from "../../../src/application/handlers/bet-lost";
import { BetMadeHandler } from "../../../src/application/handlers/bet-made";
import { BetNotMadeHandler } from "../../../src/application/handlers/bet-not-made";
import { BetVerifiedHandler } from "../../../src/application/handlers/bet-verified";
import { BetWonHandler } from "../../../src/application/handlers/bet-won";
import { MakeMartingaleBetHandler } from "../../../src/application/handlers/make-martingale-bet";
import { MartingaleFinishedHandler } from "../../../src/application/handlers/martingale-finished";
import { UpdateHistoryOnBetLostHandler } from "../../../src/application/handlers/update-history-on-bet-lost";
import { UpdateHistoryOnBetWonHandler } from "../../../src/application/handlers/update-history-on-bet-won";
import { Broker } from "../../../src/application/ports/brokers/broker";
import { StartMartingale } from "../../../src/application/usecases/start-martingale";
import { BetLost } from "../../../src/domain/events/bet-lost";
import { BetMade } from "../../../src/domain/events/bet-made";
import { BetNotMade } from "../../../src/domain/events/bet-not-made";
import { BetWon } from "../../../src/domain/events/bet-won";
import { InMemoryBroker } from "../../../src/infra/brokers/in-memory";
import { InMemoryMartingaleRepository } from "../../../src/infra/repositories/in-memory-martingale";
import { BetBuilder } from "../../utils/builders/bet";
import { BrokerSpy } from "../../utils/mocks/broker-spy";
import { HttpClientStub } from "../../utils/mocks/http-client-stub";
import { MakeBetStub } from "../../utils/mocks/make-bet-stub";
import { VerifyBetStub } from "../../utils/mocks/verify-bet-stub";

let broker: Broker;
let brokerSpy: BrokerSpy;
let martingaleRepository: InMemoryMartingaleRepository;
let makeBetStub: MakeBetStub;
let verifyBetStub: VerifyBetStub;
let httpClientStub: HttpClientStub;

beforeEach(() => {
  broker = new InMemoryBroker();
  brokerSpy = new BrokerSpy(broker);
  martingaleRepository = new InMemoryMartingaleRepository();
  makeBetStub = new MakeBetStub({ broker: brokerSpy });
  verifyBetStub = new VerifyBetStub({ broker: brokerSpy });
  httpClientStub = new HttpClientStub();
  const handlers = [
    new BetLostHandler({ martingaleRepository }),
    new BetWonHandler({ martingaleRepository }),
    new BetMadeHandler({ martingaleRepository, broker: brokerSpy }),
    new BetVerifiedHandler({ broker: brokerSpy, martingaleRepository, httpClient: httpClientStub }),
    new BetNotMadeHandler({ broker: brokerSpy }),
    new MakeMartingaleBetHandler({ broker: brokerSpy, martingaleRepository }),
    new MartingaleFinishedHandler({ broker: brokerSpy, martingaleRepository }),
    new UpdateHistoryOnBetLostHandler({ martingaleRepository }),
    new UpdateHistoryOnBetWonHandler({ martingaleRepository }),
    makeBetStub,
    verifyBetStub,
  ];
  handlers.forEach((handler) => brokerSpy.subscribe(handler));
});

test("It should emit all the events in the correct order", async () => {
  const bet = BetBuilder.aBet().withOutcome(100).build();
  makeBetStub.setEvents([new BetMade(bet), new BetMade(bet)]);
  verifyBetStub.setEvents([new BetWon(bet), new BetLost(bet)]);

  const sut = new StartMartingale({ broker: brokerSpy, martingaleRepository, httpClient: httpClientStub });
  const input = { martingaleId: "default", playerId: "1", initialBet: 10, rounds: 2, multiplier: 2 };
  await sut.execute(input);

  await new Promise((res) => setTimeout(res));
  expect(brokerSpy.events).toHaveLength(8);
  expect(brokerSpy.commands).toHaveLength(5);
  expect(brokerSpy.history).toEqual([
    "martingale-started",
    "make-martingale-bet",
    "make-bet",
    "bet-made",
    "verify-bet",
    "bet-won",
    "bet-verified",
    "make-martingale-bet",
    "make-bet",
    "bet-made",
    "verify-bet",
    "bet-lost",
    "bet-verified",
    "martingale-finished",
    "send-email",
  ]);
});

test("It should create a correct martingale history", async () => {
  const bet1 = BetBuilder.aBet().withOutcome(70).build();
  const bet2 = BetBuilder.aBet().build();
  const bet3 = BetBuilder.aBet().withValue(20).build();
  makeBetStub.setEvents([new BetMade(bet1), new BetMade(bet2), new BetMade(bet3)]);
  verifyBetStub.setEvents([new BetWon(bet1), new BetLost(bet2)]);

  const sut = new StartMartingale({ broker: brokerSpy, martingaleRepository, httpClient: httpClientStub });
  const input = { martingaleId: "default", playerId: "1", initialBet: 10, rounds: 3, multiplier: 2 };
  await sut.execute(input);

  await new Promise((res) => setTimeout(res));
  const history = await martingaleRepository.findHistory("default");
  expect(history).toHaveLength(3);
  expect(history[0]).toMatchObject({ winner: true, investiment: 10, outcome: 70, profit: 60 });
  expect(history[1]).toMatchObject({ winner: false, investiment: 10, outcome: 0, profit: -10 });
  expect(history[2]).toMatchObject({ winner: "pending", investiment: 20 });
});

test("It should retry the bet if it fails", async () => {
  const bet = BetBuilder.aBet().withOutcome(100).build();
  makeBetStub.setEvents([new BetNotMade(bet), new BetMade(bet)]);
  verifyBetStub.setEvents([new BetWon(bet)]);

  const sut = new StartMartingale({ broker: brokerSpy, martingaleRepository, httpClient: httpClientStub });
  const input = { martingaleId: "default", playerId: "1", initialBet: 10, rounds: 1, multiplier: 2 };
  await sut.execute(input);

  await new Promise((res) => setTimeout(res));
  expect(brokerSpy.events).toHaveLength(6);
  expect(brokerSpy.commands).toHaveLength(3);
  expect(brokerSpy.scheduledCommands).toHaveLength(2);
  expect(brokerSpy.history).toEqual([
    "martingale-started",
    "make-martingale-bet",
    "make-bet",
    "bet-not-made",
    "make-bet",
    "bet-made",
    "verify-bet",
    "bet-won",
    "bet-verified",
    "martingale-finished",
    "send-email",
  ]);
});

test("It should finish the execution if the same bet is not made 4 times", async () => {
  const bet = BetBuilder.aBet().withOutcome(100).build();
  makeBetStub.setEvents([new BetNotMade(bet), new BetNotMade(bet), new BetNotMade(bet), new BetNotMade(bet)]);

  const sut = new StartMartingale({ broker: brokerSpy, martingaleRepository, httpClient: httpClientStub });
  const input = { martingaleId: "default", playerId: "1", initialBet: 10, rounds: 1, multiplier: 2 };
  await sut.execute(input);

  await new Promise((res) => setTimeout(res));
  expect(brokerSpy.events).toHaveLength(6);
  expect(brokerSpy.commands).toHaveLength(3);
  expect(brokerSpy.scheduledCommands).toHaveLength(3);
  expect(brokerSpy.history).toEqual([
    "martingale-started",
    "make-martingale-bet",
    "make-bet",
    "bet-not-made",
    "make-bet",
    "bet-not-made",
    "make-bet",
    "bet-not-made",
    "make-bet",
    "bet-not-made",
    "martingale-finished",
    "send-email",
  ]);
});

test("It should throw an error if there isnt at least one round", async () => {
  const sut = new StartMartingale({ broker, martingaleRepository, httpClient: httpClientStub });
  const input = { martingaleId: "default", playerId: "1", initialBet: 10, rounds: 0, multiplier: 2 };
  await expect(sut.execute(input)).rejects.toThrow("There must be at least one round");
});
