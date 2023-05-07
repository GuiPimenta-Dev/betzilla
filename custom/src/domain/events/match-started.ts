import { Event } from "./event";

type Payload = {
  matchId: string;
  name: string;
  date: string;
  rule: string;
};

export class MatchStarted extends Event {
  constructor(payload: Payload) {
    super("match-started", payload);
  }
}
