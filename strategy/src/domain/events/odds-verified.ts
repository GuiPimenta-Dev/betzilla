import { Event } from "./event";

export type Odd = {
  id: string;
  back: number[];
  lay: number[];
};

type Payload = {
  matchId: string;
  odds: Odd[];
};

export class OddsVerified extends Event {
  constructor(payload: Payload) {
    super("odds-verified", payload);
  }
}
