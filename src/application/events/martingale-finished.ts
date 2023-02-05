import { Event } from "./event";

export class MartingaleFinishedEvent extends Event {
  constructor(payload: { id: string }) {
    super("martingale-finished", payload);
  }
}
