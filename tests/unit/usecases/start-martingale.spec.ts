import { StartMartingale } from "../../../src/application/usecases/start-martingale";
import { InMemoryBroker } from "../../../src/infra/brokers/in-memory";
import { InMemoryMartingaleRepository } from "../../../src/infra/repositories/in-memory-martingale";
import { InMemoryPlayerRepository } from "../../../src/infra/repositories/in-memory-player";
import { TestConfigFactory } from "../../utils/test-config-factory";

test("It should emit the events in the correct order", async () => {
  const config = new TestConfigFactory().create();
  config.betGateway.mockConsultBet([
    { status: "pending", amount: 0 },
    { status: "won", amount: 20 },
  ]);

  const sut = new StartMartingale({ ...config });
  const input = { playerId: "default", initialBet: 10, rounds: 1, multiplier: 2 };
  await sut.execute(input);

  await new Promise((res) => setTimeout(res));
  expect(config.broker.events).toHaveLength(5);
  expect(config.broker.commands).toHaveLength(4);
  expect(config.broker.scheduledCommands).toHaveLength(2);
  expect(config.broker.actions).toEqual([
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
  const config = new TestConfigFactory().create();
  config.betGateway.mockConsultBet([
    { status: "lost", amount: 0 },
    { status: "lost", amount: 0 },
    { status: "won", amount: 70 },
    { status: "won", amount: 40 },
    { status: "lost", amount: 0 },
  ]);
  const sut = new StartMartingale({ ...config });
  const input = { playerId: "default", initialBet: 10, rounds: 5, multiplier: 2 };
  const { martingaleId } = await sut.execute(input);

  await new Promise((res) => setTimeout(res));
  const player = await config.playerRepository.findById("default");
  const history = await config.martingaleRepository.findHistory(martingaleId);
  expect(player.account.getBalance()).toBe(1020);
  expect(history).toHaveLength(5);
  expect(history[0]).toMatchObject({ winner: false, investiment: 10, outcome: 0, profit: -10 });
  expect(history[1]).toMatchObject({ winner: false, investiment: 20, outcome: 0, profit: -20 });
  expect(history[2]).toMatchObject({ winner: true, investiment: 40, outcome: 70, profit: 30 });
  expect(history[3]).toMatchObject({ winner: true, investiment: 10, outcome: 40, profit: 30 });
  expect(history[4]).toMatchObject({ winner: false, investiment: 10, outcome: 0, profit: -10 });
});

test("It should send a report after martingale is finished", async () => {
  const config = new TestConfigFactory().create();

  const sut = new StartMartingale({ ...config });
  const input = { playerId: "default", initialBet: 10, rounds: 1, multiplier: 2 };
  await sut.execute(input);

  await new Promise((res) => setTimeout(res));
  expect(config.mailer.to).toBeDefined();
  expect(config.mailer.subject).toBe("Martingale Finished");
  expect(config.mailer.body).toBeDefined();
});

test("It should throw an error if there isnt at least one round", async () => {
  const broker = new InMemoryBroker();
  const playerRepository = new InMemoryPlayerRepository();
  const martingaleRepository = new InMemoryMartingaleRepository();

  const sut = new StartMartingale({ broker, martingaleRepository, playerRepository });
  const input = { playerId: "default", initialBet: 10, rounds: 0, multiplier: 2 };
  await expect(sut.execute(input)).rejects.toThrow("There must be at least one round");
});

test("It should throw an error if user does not have enough balance", async () => {
  const broker = new InMemoryBroker();
  const playerRepository = new InMemoryPlayerRepository();
  playerRepository.createDefaultPlayer();
  const martingaleRepository = new InMemoryMartingaleRepository();

  const sut = new StartMartingale({ broker, martingaleRepository, playerRepository });
  const input = { playerId: "default", initialBet: 2000, rounds: 1, multiplier: 2 };
  await expect(sut.execute(input)).rejects.toThrow("Insufficient Funds");
});
