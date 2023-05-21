import { Bot, Condition } from "./bot";

import { Odd } from "../../events/odds-verified";
import { RuleFactory } from "../../services/rules/factory";
import { Match } from "../match";

type Input = {
  id: string;
  name: string;
  playerId: string;
  market: string;
  side: string;
  betValue: number;
  conditions: Condition[];
};

export class PlayerRules implements Bot {
  id: string;
  name: string;
  playerId: string;
  market: string;
  side: string;
  betValue: number;
  conditions: Condition[];

  constructor(input: Input) {
    this.id = input.id;
    this.name = input.name;
    this.playerId = input.playerId;
    this.market = input.market;
    this.side = input.side;
    this.betValue = input.betValue;
    this.conditions = input.conditions;
  }

  shouldBet(match: Match, odds: Odd[]): boolean {
    const ruleFactory = new RuleFactory(match, odds, this.side);
    const rules = ruleFactory.getRules(this.conditions);
    for (const rule of rules) {
      if (!rule.shouldBet()) {
        return false;
      }
      return true;
    }
  }
}
