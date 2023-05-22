import { Odd } from "../events/odds-verified";
type Side = "back" | "lay";
type Guess = "home" | "away" | "draw";

export class ExpectedValue {
  constructor(private odd: Odd, private betValue: number) {}

  getEV(side: Side): any {
    const maxOdd = this.getMaxOdd(side);
    const fairOdd = this.getFairOdd(maxOdd, side);
    const probabilityOfWinning = 1 / fairOdd;
    const probabilityOfLosing = 1 - probabilityOfWinning;
    const oddAverage = this.getOddsAverage(side);
    const possibleProfit = this.betValue * oddAverage - this.betValue;
    const expectedValue = probabilityOfWinning * possibleProfit - probabilityOfLosing * this.betValue;
    return { expectedValue, side, oddId: this.odd.id, odd: maxOdd };
  }

  private getMaxOdd(side: Side) {
    const odds = this.odd[side];
    return Math.max(...odds);
  }

  private getFairOdd(odd: number, side: Side) {
    const oddIndex = this.odd[side].indexOf(odd);
    const oppositeType = side === "back" ? "lay" : "back";
    const oppositeOdds = this.odd[oppositeType];
    const oppositeOdd = oppositeOdds[oddIndex];
    return (odd + oppositeOdd) / 2;
  }

  private getOddsAverage(side: Side) {
    const odds = this.odd[side];
    const sum = odds.reduce((a, b) => a + b, 0);
    return sum / odds.length;
  }
}
