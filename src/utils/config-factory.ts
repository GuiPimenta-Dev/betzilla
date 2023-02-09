import { MailerSpy } from "../../tests/utils/mocks/mailer-spy";
import { BetMadeHandler } from "../application/handlers/martingale/bet-made";
import { BetVerifiedHandler } from "../application/handlers/martingale/bet-verified";
import { MakeMartingaleBetHandler } from "../application/handlers/martingale/make-martingale-bet";
import { MartingaleFinishedHandler } from "../application/handlers/martingale/martingale-finished";
import { CreditAccountHandler } from "../application/handlers/player/credit-account";
import { DebitAccountHandler } from "../application/handlers/player/debit-account";
import { MakeBetHandler } from "../application/handlers/player/make-bet";
import { VerifyBetHandler } from "../application/handlers/player/verify-bet";
import { InMemoryBroker } from "../infra/brokers/in-memory";
import { FakeBetGateway } from "../infra/gateways/bet-gateway";
import { InMemoryMartingaleRepository } from "../infra/repositories/in-memory-martingale";
import { InMemoryPlayerRepository } from "../infra/repositories/in-memory-player";

export class ConfigFactory {
  dependencies = {
    broker: new InMemoryBroker(),
    martingaleRepository: new InMemoryMartingaleRepository(),
    playerRepository: new InMemoryPlayerRepository(),
    betGateway: new FakeBetGateway(),
    mailer: new MailerSpy(),
  };

  create() {
    this.registerHandlers();
    this.dependencies.playerRepository.createDefaultPlayer();
    return this.dependencies;
  }

  private registerHandlers() {
    const handlers = [
      new MakeMartingaleBetHandler(this.dependencies),
      new MakeBetHandler(this.dependencies),
      new BetMadeHandler(this.dependencies),
      new DebitAccountHandler(this.dependencies),
      new VerifyBetHandler(this.dependencies),
      new BetVerifiedHandler(this.dependencies),
      new MartingaleFinishedHandler(this.dependencies),
      new CreditAccountHandler(this.dependencies),
    ];
    handlers.forEach((handler) => this.dependencies.broker.register(handler));
  }
}
