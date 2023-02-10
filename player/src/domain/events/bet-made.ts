import { Event } from "./event";

type Payload = {
  betId: string;
  betValue: number;
  playerId: string;
};

export class BetMade extends Event {
  constructor(payload: Payload) {
    super("bet-made", payload);
  }
}
