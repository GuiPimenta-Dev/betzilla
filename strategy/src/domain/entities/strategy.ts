export type Condition = {
  name: string;
  value?: number;
  params?: any;
};

type Input = {
  id: string;
  playerId: string;
  market: string;
  type: string;
  betValue: number;
  conditions: Condition[];
};

export class Strategy {
  id: string;
  playerId: string;
  market: string;
  type: string;
  betValue: number;
  conditions: Condition[];

  constructor(input: Input) {
    this.id = input.id;
    this.playerId = input.playerId;
    this.market = input.market;
    this.type = input.type;
    this.conditions = input.conditions;
    this.betValue = input.betValue;
  }
}
