import { Event } from "./event";

export type Odd = {
  id: string;
  back: number[];
  lay: number[];
};

type Match = {
  id: string;
  name: string;
};

type Payload = {
  strategyId: string;
  match: Match;
  odds: Odd[];
};

export class OddsVerified extends Event {
  constructor(payload: Payload) {
    super("odds-verified", payload);
  }
}
