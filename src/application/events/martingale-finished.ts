import { Event } from "./event";

export class MartingaleFinishedEvent extends Event {
  constructor(payload: { martingaleId: string; playerId: string }) {
    super("martingale-finished", payload);
  }
}
