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
    return new Bet({ id: "id", playerId: "default", value: this.value, strategy: { id: "id", name: "name" } });
  }
}
