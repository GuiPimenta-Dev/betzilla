export type Condition = {
  name: string;
  value?: number;
  params?: any;
};

type Input = {
  id: string;
  name: string;
  playerId: string;
  marketId?: number;
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

  constructor(input: Input) {
    this.id = input.id;
    this.name = input.name;
    this.playerId = input.playerId;
    this.marketId = input.marketId;
    this.side = input.side;
    this.betValue = input.betValue;
    this.conditions = input.conditions;
  }
}
