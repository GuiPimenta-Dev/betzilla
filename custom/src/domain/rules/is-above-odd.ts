import { Odd } from "../events/odds-verified";
import { Rule } from "./rule";

export class IsAboveOdd implements Rule {
  constructor(private odds: Odd[], private minOdd: number, private type: string) {}

  shouldBet(): boolean {
    let biggestOdd = 0;
    for (const odd of this.odds) {
      const odds = odd[this.type];
      const max = Math.max(...odds);
      if (max >= biggestOdd) {
        biggestOdd = max;
      }
    }
    if (biggestOdd >= this.minOdd) {
      return true;
    }
    return false;
  }
}
