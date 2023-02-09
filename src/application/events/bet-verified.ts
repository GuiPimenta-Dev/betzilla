import { Bet } from "../ports/gateways/bet";
import { Event } from "./event";

type Payload = {
  betId: string;
  status: Bet["status"];
};

export class BetVerifiedEvent extends Event {
  constructor(payload: Payload) {
    super("bet-verified", payload);
  }
}
