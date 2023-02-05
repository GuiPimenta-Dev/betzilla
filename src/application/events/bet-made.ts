import { Event } from "./event";

type Payload = {
  playerId: string;
  betValue: number;
  betId: string;
};

export class BetMadeEvent extends Event {
  constructor(payload: Payload) {
    super("bet-made", payload);
  }
}
