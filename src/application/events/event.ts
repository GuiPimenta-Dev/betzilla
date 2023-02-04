import { v4 as uuid } from "uuid";

export class Event {
  readonly id: string;
  readonly timestamp: Date;

  constructor(public readonly name: string, public readonly payload: any) {
    this.id = uuid();
    this.timestamp = new Date();
  }
}
