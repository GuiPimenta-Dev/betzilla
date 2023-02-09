import { Event } from "../event";

type Payload = {
  betId: string;
  amount: number;
};

export class BetWonEvent extends Event {
  constructor(payload: Payload) {
    super("bet-won", payload);
  }
}
