import { CreditPlayerAccountHandler } from "../../application/handlers/credit-player-account";
import { MakeBetHandler } from "../../application/handlers/make-bet";
import { MakeMartingaleBetHandler } from "../../application/handlers/make-martingale-bet";
import { MartingaleFinishedHandler } from "../../application/handlers/martingale-finished";
import { MartingaleVerifiedHandler } from "../../application/handlers/martingale-verified";
import { VerifyMartingaleHandler } from "../../application/handlers/verify-martingale";
import { InMemoryBroker } from "../../infra/brokers/in-memory";
import { FakeBetGateway } from "../../infra/gateways/bet-gateway";
import { NodeMailerGateway } from "../../infra/gateways/node-mailer-gateway";
import { InMemoryMartingaleRepository } from "../../infra/repositories/in-memory-martingale";
import { InMemoryPlayerRepository } from "../../infra/repositories/in-memory-player";

export class ConfigFactory {
  dependencies = {
    broker: new InMemoryBroker(),
    martingaleRepository: new InMemoryMartingaleRepository(),
    playerRepository: new InMemoryPlayerRepository(),
    betGateway: new FakeBetGateway(),
    mailer: new NodeMailerGateway(),
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
