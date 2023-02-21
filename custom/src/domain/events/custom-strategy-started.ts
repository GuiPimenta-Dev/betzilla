import { CustomStrategy } from "../../application/ports/repositories/strategy";
import { Event } from "./event";

export class CustomStrategyStarted extends Event {
  constructor(public readonly payload: CustomStrategy) {
    super("custom-strategy-started", payload);
  }
}
