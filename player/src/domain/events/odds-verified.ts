import { Odd } from "../../application/ports/gateways/bet";
import { Event } from "./event";

type Match = {
  id: string;
  name: string;
};

type Payload = {
  match: Match;
  strategyId: string;
  odds: Odd;
};

export class OddsVerified extends Event {
  constructor(payload: Payload) {
    super("odds-verified", payload);
  }
}
