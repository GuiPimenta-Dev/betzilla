import { Strategy } from "./strategy";

export class Over05HT implements Strategy {
  name = "over-05-ht";
  private odd = 1.6;

  bet(odd: number): boolean {
    if (odd >= this.odd) return true;
    return false;
  }
}
