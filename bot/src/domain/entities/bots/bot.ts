import { Odd } from "../../events/odds-verified";
import { Match } from "../match";

export type Condition = {
  name: string;
  value?: number;
  params?: any;
};

export interface Bot {
  id: string;
  name: string;
  playerId: string;
  market: string;
  side: string;
  betValue: number;
  conditions?: Condition[];
  shouldBet(match: Match, odds: Odd[]): boolean;
}
