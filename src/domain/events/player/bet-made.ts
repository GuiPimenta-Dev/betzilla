import { Event } from "../event";

type Payload = {
  betId: string;
  betValue: number;
};

export class BetMadeEvent extends Event {
  constructor(payload: Payload) {
    super("bet-made", payload);
  }
}
