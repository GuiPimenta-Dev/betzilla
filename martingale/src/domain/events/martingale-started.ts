import { Event } from "./event";

type Input = {
  martingaleId: string;
  playerId: string;
};

export class MartingaleStarted extends Event {
  constructor(payload: Input) {
    super("martingale-started", payload);
  }
}
