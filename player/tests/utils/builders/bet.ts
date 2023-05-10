export class BetBuilder {
  value: number = 100;

  static aBet() {
    return new BetBuilder();
  }

  withValue(value: number) {
    this.value = value;
    return this;
  }

  build() {
    return {
      matchId: "match-id",
      playerId: "player-id",
      betValue: this.value,
      marketId: "market-id",
      oddId: "odd-id",
      type: "type",
      odd: 1.5,
    };
  }
}
