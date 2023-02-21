import { Event } from "./event";

export class CustomStrategyStarted extends Event {
  constructor(public readonly payload: any) {
    super("custom-strategy-started", payload);
  }
}
