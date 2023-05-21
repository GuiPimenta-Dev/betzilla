import { Event } from "./event";

export class HalfTimeFinished extends Event {
  constructor(id: string) {
    super("half-time-finished", { matchId: id });
  }
}
