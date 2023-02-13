import { Handler } from "../../../src/application/handlers/handler";
import { Broker } from "../../../src/application/ports/brokers/broker";
import { MartingaleRepository } from "../../../src/application/ports/repositories/martingale";
import { VerifyBet } from "../../../src/domain/commands/verify-bet";
import { BetLost } from "../../../src/domain/events/bet-lost";
import { BetVerified } from "../../../src/domain/events/bet-verified";
import { BetWon } from "../../../src/domain/events/bet-won";

type Dependencies = {
  broker: Broker;
  martingaleRepository: MartingaleRepository;
};

export class VerifyBetFake implements Handler {
  name = "verify-bet";
  broker: Broker;
  martingaleRepository: MartingaleRepository;

  constructor(input: Dependencies) {
    this.martingaleRepository = input.martingaleRepository;
    this.broker = input.broker;
  }

  async handle(input: VerifyBet): Promise<void> {
    const { payload } = input;
    let response;
    if (Math.random() <= 0.5) {
      const martingale = await this.martingaleRepository.findById(payload.betId);
      response = { status: "won", outcome: Math.round(martingale.getBet()) * 2 };
    } else {
      response = { status: "lost", outcome: 0 };
    }
    let event;
    if (response.status === "won") {
      event = new BetWon(payload);
      event.outcome = response.outcome;
    } else {
      event = new BetLost(payload);
    }
    await this.broker.publish(event);
    await this.broker.publish(new BetVerified(payload));
  }
}
