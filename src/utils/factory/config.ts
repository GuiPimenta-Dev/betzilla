import { CreditPlayerAccountHandler } from "../../application/handlers/credit-player-account";
import { FakeBetGateway } from "../../infra/gateways/bet-gateway";
import { InMemoryBroker } from "../../infra/brokers/in-memory";
import { InMemoryMartingaleRepository } from "../../infra/repositories/in-memory-martingale";
import { InMemoryPlayerRepository } from "../../infra/repositories/in-memory-player";
import { MailerSpy } from "../../../tests/utils/mocks/mailer-spy";
import { MakeBetHandler } from "../../application/handlers/make-bet";
import { MakeMartingaleBetHandler } from "../../application/handlers/make-martingale-bet";
import { MartingaleFinishedHandler } from "../../application/handlers/martingale-finished";
import { MartingaleVerifiedHandler } from "../../application/handlers/martingale-verified";
import { VerifyMartingaleHandler } from "../../application/handlers/verify-martingale";

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
      new MakeMartingaleBetHandler({ ...this.dependencies }),
      new MakeBetHandler({ ...this.dependencies }),
      new VerifyMartingaleHandler({ ...this.dependencies }),
      new MartingaleVerifiedHandler({ ...this.dependencies }),
      new MartingaleFinishedHandler({ ...this.dependencies }),
      new CreditPlayerAccountHandler({ ...this.dependencies }),
    ];
    handlers.forEach((handler) => this.dependencies.broker.register(handler));
  }
}
