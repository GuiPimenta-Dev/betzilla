import { HistoryItem } from "../../../src/application/ports/repositories/martingale";

export class HistoryItemBuilder {
  betId: string = "default";
  winner: boolean | string;
  investiment: number = 10;
  outcome: number = null;
  profit: number = null;

  static aPending() {
    const historyItem = new HistoryItemBuilder();
    historyItem.winner = "pending";
    return historyItem;
  }

  static aWin() {
    const historyItem = new HistoryItemBuilder();
    historyItem.winner = true;
    return historyItem;
  }

  static aLoss() {
    const historyItem = new HistoryItemBuilder().withOutcome(0);
    historyItem.winner = false;
    return historyItem;
  }

  withBetId(betId: string) {
    this.betId = betId;
    return this;
  }

  withOutcome(outcome: number) {
    this.outcome = outcome;
    this.profit = this.outcome - this.investiment;
    return this;
  }

  build(): HistoryItem {
    return {
      betId: this.betId,
      martingaleId: "default",
      winner: this.winner,
      investiment: this.investiment,
      outcome: this.outcome,
      profit: this.profit,
    };
  }
}
