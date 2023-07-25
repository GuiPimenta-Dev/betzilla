export type Condition = {
  name: string;
  value?: number;
  params?: any;
};

export type Status = "running" | "paused";

type Input = {
  id: string;
  name: string;
  playerId: string;
  marketId?: number;
  running?: boolean;
  side?: string;
  betValue: number;
  conditions?: Condition[];
};

export class Bot {
  id: string;
  name: string;
  playerId: string;
  marketId: number;
  side: string;
  betValue: number;
  conditions?: Condition[];
  running: boolean;

  constructor(input: Input) {
    this.id = input.id;
    this.name = input.name;
    this.playerId = input.playerId;
    this.marketId = input.marketId;
    this.side = input.side;
    this.betValue = input.betValue;
    this.conditions = input.conditions;
    this.running = input.running;
  }

  pause(): void {
    this.running = false;
  }

  resume(): void {
    this.running = true;
  }
}
