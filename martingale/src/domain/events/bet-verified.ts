import { Event } from "./event";

type Payload = {
  betId: string;
  status: "lost" | "won" | "pending";
};

export class BetVerified extends Event {
  constructor(payload: Payload) {
    super("bet-verified", payload);
  }
}
