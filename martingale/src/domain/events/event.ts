export class Event {
  readonly timestamp: Date;

  constructor(public readonly name: string, public readonly payload: any) {
    this.timestamp = new Date();
  }
}
