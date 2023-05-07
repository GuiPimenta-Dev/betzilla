import { Event } from "./event";
import { StrategyInfo } from "../../application/ports/repositories/strategy";

export class StrategyStarted extends Event {
  constructor(payload: StrategyInfo) {
    super("strategy-started", payload);
  }
}
