import { Event } from "./event";

export class BetMadeEvent extends Event {
  constructor(readonly accountId: string, readonly betValue: number, readonly betId: string) {
    super("bet-made", { accountId, betValue, betId });
  }
}
