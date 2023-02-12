import { Bet } from "../../../src/domain/entities/bet";

export class BetBuilder {
  value: number = 10;

  static aBet() {
    return new BetBuilder();
  }

  withValue(value: number) {
    this.value = value;
    return this;
  }

  build(): Bet {
    return new Bet({ playerId: "default", value: this.value, martingaleId: "default" });
  }
}
