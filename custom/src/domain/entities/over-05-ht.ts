import { ShouldBet, Strategy } from "./strategy";

import { Odd } from "../events/odds-verified";

export class Over05HT implements Strategy {
  market = "Over/Under 0.5 Goals";
  private odd = 1.6;

  bet(odd: Odd[]): ShouldBet {
    const { back } = odd[0];
    const max = Math.max(...back);
    if (max >= this.odd) return { shouldBet: true, bet: { id: odd[0].id, odd: max } };
    return { shouldBet: false };
  }
}
