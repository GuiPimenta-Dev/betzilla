import { Odd } from "../events/odds-verified";
import { Rule } from "./rule";

export class IsBelowOdd implements Rule {
  constructor(private odds: Odd[], private maxOdd: number, private type: string) {}

  shouldBet(): boolean {
    let lowestOdd = 1000;
    for (const odd of this.odds) {
      const odds = odd[this.type];
      const min = Math.min(...odds);
      if (min <= lowestOdd) {
        lowestOdd = min;
      }
    }
    if (lowestOdd <= this.maxOdd) {
      return true;
    }
    return false;
  }
}
