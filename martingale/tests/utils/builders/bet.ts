import { Bet } from "../../../src/domain/entities/bet";

export class BetBuilder {
  value: number = 10;
  outcome: number;

  static aBet() {
    return new BetBuilder();
  }

  withValue(value: number) {
    this.value = value;
    return this;
  }

  withOutcome(outcome: number) {
    this.outcome = outcome;
    return this;
  }

  build(): Bet {
    const bet = new Bet({ playerId: "default", value: this.value, martingaleId: "default" });
    if (this.outcome) bet.outcome = this.outcome;
    return bet;
  }
}
