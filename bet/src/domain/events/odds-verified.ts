import { Odd } from "../../application/ports/gateways/bet";
import { Event } from "./event";

type Payload = {
  matchId: string;
  odds: Odd[];
};

export class OddsVerified extends Event {
  constructor(payload: Payload) {
    super("odds-verified", payload);
  }
}
