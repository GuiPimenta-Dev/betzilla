import { Odd } from "../../events/odds-verified";
import { Rule } from "./rule";

type Guess = "home" | "away" | "draw";
type Type = "back" | "lay";

export class IsPositiveEV implements Rule {
  constructor(private odds: Odd[], private guess: Guess, private type: Type, private betValue: number) {}

  shouldBet(): boolean {
    const resultIndex = this.getHomeOrAwayOrDrawOdds();
    if (this.odds.length <= resultIndex) return false;
    const maxOdd = this.getMaxOdd(resultIndex);
    const fairOdd = this.getFairOdd(maxOdd, resultIndex);
    const probabilityOfWinning = 1 / fairOdd;
    const probabilityOfLosing = 1 - probabilityOfWinning;
    const oddAverage = this.getOddsAverage(resultIndex);
    const possibleProfit = this.betValue * oddAverage - this.betValue;
    const expectedValue = probabilityOfWinning * possibleProfit - probabilityOfLosing * this.betValue;
    return expectedValue > 0;
  }

  private getHomeOrAwayOrDrawOdds(): number {
    const possibilities = { home: 0, away: 1, draw: 2 };
    return possibilities[this.guess];
  }

  private getMaxOdd(index: number) {
    const odds = this.odds[index][this.type];
    return Math.max(...odds);
  }

  private getFairOdd(odd: number, resultIndex: number) {
    const oddIndex = this.odds[resultIndex][this.type].indexOf(odd);
    const oppositeType = this.type === "back" ? "lay" : "back";
    const oppositeOdds = this.odds[resultIndex][oppositeType];
    const oppositeOdd = oppositeOdds[oddIndex];
    return (odd + oppositeOdd) / 2;
  }

  private getOddsAverage(index: number) {
    const odds = this.odds[index][this.type];
    const sum = odds.reduce((a, b) => a + b, 0);
    return sum / odds.length;
  }
}
