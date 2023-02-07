import { MailerSpy } from "../../tests/utils/mocks/mailer-spy";
import { InMemoryBroker } from "../infra/brokers/in-memory";
import { FakeBetGateway } from "../infra/gateways/bet-gateway";
import { InMemoryMartingaleRepository } from "../infra/repositories/in-memory-martingale";
import { InMemoryPlayerRepository } from "../infra/repositories/in-memory-player";
import { registerHandlers } from "./register-handlers";

export class ConfigFactory {
  dependencies = {
    broker: new InMemoryBroker(),
    martingaleRepository: new InMemoryMartingaleRepository(),
    playerRepository: new InMemoryPlayerRepository(),
    betGateway: new FakeBetGateway(),
    mailer: new MailerSpy(),
  };

  create() {
    registerHandlers(this.dependencies);
    this.dependencies.playerRepository.createDefaultPlayer();
    return this.dependencies;
  }
}
