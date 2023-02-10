import { Bet } from "../../application/ports/gateways/bet";
import { Event } from "./event";

type Payload = {
  betId: string;
  status: Bet["status"];
};

export class BetVerified extends Event {
  constructor(payload: Payload) {
    super("bet-verified", payload);
  }
}
