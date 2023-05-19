import { Match } from "../entities/match";
import { Condition } from "../entities/strategy";
import { Odd } from "../events/odds-verified";
import { IsAboveOdd } from "./is-above-odd";
import { IsAfterMinute } from "./is-after-minute";
import { IsBeforeMinute } from "./is-before-minute";
import { IsBelowOdd } from "./is-below-odd";
import { IsFullTime } from "./is-full-time";
import { IsHalfTime } from "./is-half-time";
import { IsPositiveEV } from "./is-positive-ev";
import { Rule } from "./rule";

export class RuleFactory {
  constructor(private match: Match, private odds: Odd[], private type: string) {}

  getRules(conditions: Condition[]): Rule[] {
    const rules: Rule[] = [];
    for (const condition of conditions) {
      switch (condition.name) {
        case "IS_ABOVE_ODD": {
          rules.push(new IsAboveOdd(this.odds, condition.value, this.type));
          break;
        }

        case "IS_BELOW_ODD": {
          rules.push(new IsBelowOdd(this.odds, condition.value, this.type));
          break;
        }

        case "IS_HALF_TIME": {
          rules.push(new IsHalfTime(this.match));
          break;
        }

        case "IS_FULL_TIME": {
          rules.push(new IsFullTime(this.match));
          break;
        }

        case "IS_BEFORE_MINUTE": {
          rules.push(new IsBeforeMinute(this.match, condition.value));
          break;
        }

        case "IS_AFTER_MINUTE": {
          rules.push(new IsAfterMinute(this.match, condition.value));
          break;
        }

        case "IS_POSITIVE_EXPECTED_VALUE": {
          rules.push(new IsPositiveEV(this.odds, condition.params.guess, condition.params.type, condition.value));
          break;
        }

        default: {
          throw new Error("Invalid condition");
        }
      }
    }
    return rules;
  }
}
