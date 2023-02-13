import { MartingaleRepository } from "../ports/repositories/martingale";

type Dependencies = {
  martingaleRepository: MartingaleRepository;
};

export class GetHistory {
  martingaleRepository: MartingaleRepository;

  constructor(input: Dependencies) {
    this.martingaleRepository = input.martingaleRepository;
  }

  async execute(martingaleId: string): Promise<Output> {
    const martingale = await this.martingaleRepository.findById(martingaleId);
    let history = await this.martingaleRepository.findHistory(martingaleId);
    const presentedHistory = history.map((item) => {
      return { winner: item.winner, investiment: item.investiment, outcome: item.outcome, profit: item.profit };
    });
    const profit = Math.round(history.reduce((acc, curr) => (curr.profit ? acc + curr.profit : acc), 0));
    return { history: presentedHistory, profit, status: martingale.status };
  }
}

type PresentedHistory = {
  winner: boolean | string;
  investiment: number;
  outcome: number;
  profit?: number;
};

type Output = {
  history: PresentedHistory[];
  profit: number;
  status?: string;
};
