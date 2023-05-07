import { Event } from "./event";

export class MatchFinished extends Event {
  constructor(id: string) {
    super("match-finished", { matchId: id });
  }
}
