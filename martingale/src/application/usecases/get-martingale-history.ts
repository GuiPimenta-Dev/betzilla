import { HistoryItem, MartingaleRepository } from "../ports/repositories/martingale";

type Dependencies = {
  martingaleRepository: MartingaleRepository;
};

export class GetMartingaleHistory {
  martingaleRepository: MartingaleRepository;

  constructor(input: Dependencies) {
    this.martingaleRepository = input.martingaleRepository;
  }

  async execute(martingaleId: string): Promise<Output> {
    const history = await this.martingaleRepository.findHistory(martingaleId);
    const balance = Math.round(history.reduce((acc, curr) => acc + curr.profit, 0));
    return { history, balance };
  }
}

type Output = {
  history: HistoryItem[];
  balance: number;
};
