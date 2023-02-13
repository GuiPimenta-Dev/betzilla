import { GetHistory } from "../../../src/application/usecases/get-history";
import { InMemoryMartingaleRepository } from "../../../src/infra/repositories/in-memory-martingale";
import { HistoryItemBuilder } from "../../utils/builders/history-item";

test("It should be get the history of a martingale with a pending bet", async () => {
  const martingaleRepository = new InMemoryMartingaleRepository();
  const pending = HistoryItemBuilder.aPending().build();
  martingaleRepository.createDefaultMartingale()
  martingaleRepository.createHistoryItem(pending);

  const sut = new GetHistory({ martingaleRepository });
  const history = await sut.execute("default");

  expect(history).toMatchObject({
    history: [
      {
        winner: "pending",
        investiment: 10,
        outcome: null,
        profit: null,
      },
    ],
    profit: 0,
  });
});

test("It should be able to get the history of a martingale and calculate the balance with a win", async () => {
  const martingaleRepository = new InMemoryMartingaleRepository();
  const win = HistoryItemBuilder.aWin().withOutcome(100).build();
  martingaleRepository.createDefaultMartingale()
  martingaleRepository.createHistoryItem(win);

  const sut = new GetHistory({ martingaleRepository });
  const history = await sut.execute("default");

  expect(history).toMatchObject({
    history: [{ winner: true, investiment: 10, outcome: 100, profit: 90 }],
    profit: 90,
  });
});

test("It should be able to get the history of a martingale and calculate the balance with a loss", async () => {
  const martingaleRepository = new InMemoryMartingaleRepository();
  const loss = HistoryItemBuilder.aLoss().build();
  martingaleRepository.createDefaultMartingale()
  martingaleRepository.createHistoryItem(loss);

  const sut = new GetHistory({ martingaleRepository });
  const history = await sut.execute("default");

  expect(history).toMatchObject({
    history: [{ winner: false, investiment: 10, outcome: 0, profit: -10 }],
    profit: -10,
  });
});

test("It should be able to get the history of a martingale and calculate the balance with multiple bets", async () => {
  const martingaleRepository = new InMemoryMartingaleRepository();
  const win = HistoryItemBuilder.aWin().withOutcome(100).build();
  const loss = HistoryItemBuilder.aLoss().build();
  martingaleRepository.createDefaultMartingale()
  martingaleRepository.createHistoryItem(win);
  martingaleRepository.createHistoryItem(loss);

  const sut = new GetHistory({ martingaleRepository });
  const history = await sut.execute("default");

  expect(history).toMatchObject({
    history: [
      { winner: true, investiment: 10, outcome: 100, profit: 90 },
      { winner: false, investiment: 10, outcome: 0, profit: -10 },
    ],
    profit: 80,
  });
});

test("It should disconsider the balance from a pending bet", async () => {
  const martingaleRepository = new InMemoryMartingaleRepository();
  const win = HistoryItemBuilder.aWin().withOutcome(100).build();
  const loss = HistoryItemBuilder.aLoss().build();
  const pending = HistoryItemBuilder.aPending().build();
  martingaleRepository.createDefaultMartingale()
  martingaleRepository.createHistoryItem(win);
  martingaleRepository.createHistoryItem(loss);
  martingaleRepository.createHistoryItem(pending);

  const sut = new GetHistory({ martingaleRepository });
  const history = await sut.execute("default");

  expect(history).toMatchObject({
    history: [
      { winner: true, investiment: 10, outcome: 100, profit: 90 },
      { winner: false, investiment: 10, outcome: 0, profit: -10 },
      { winner: "pending", investiment: 10, outcome: null, profit: null },
    ],
    profit: 80,
  });
});
