import { Odd } from "../events/odds-verified";

export type ShouldBet = {
  shouldBet: boolean;
  bet?: {
    id: string;
    odd: number;
  };
};

export interface Strategy {
  market: string;
  bet(odd: Odd[]): ShouldBet;
}
