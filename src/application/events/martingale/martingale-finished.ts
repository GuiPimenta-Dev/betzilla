import { Event } from "../event";

type Input = {
  martingaleId: string;
  playerId: string;
};

export class MartingaleFinishedEvent extends Event {
  constructor(payload: Input) {
    super("martingale-finished", payload);
  }
}
