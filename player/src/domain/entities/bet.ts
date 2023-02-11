type Strategy = {
  id: string;
  name: string;
};

export class Bet {
  constructor(
    public readonly id: string,
    public readonly playerId: string,
    public readonly strategy: Strategy,
    public readonly value: number
  ) {}
}
