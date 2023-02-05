import { Bet } from "../ports/gateways/bet";
import { Event } from "./event";

type Payload = {
  betId: string;
  accountId: string;
  status: Bet["status"];
};

export class MartingaleVerifiedEvent extends Event {
  constructor(payload: Payload) {
    super("martingale-verified", payload);
  }
}
