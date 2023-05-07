import { Event } from "./event";

export class MatchStarted extends Event {
  constructor(id: string) {
    super("match-started", { matchId: id });
  }
}
