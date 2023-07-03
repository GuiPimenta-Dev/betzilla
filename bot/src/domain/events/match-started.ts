import { Event } from "./event";

type Payload = {
  matchId: string;
  name: string;
  date: string;
  botId: string;
  marketId: number;
};

export class MatchStarted extends Event {
  constructor(payload: Payload) {
    super("match-started", payload);
  }
}
