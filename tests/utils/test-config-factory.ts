import { InMemoryBroker } from "../../src/infra/brokers/in-memory";
import { InMemoryMartingaleRepository } from "../../src/infra/repositories/in-memory-martingale";
import { InMemoryPlayerRepository } from "../../src/infra/repositories/in-memory-player";
import { registerHandlers } from "../../src/utils/register-handlers";
import { BetGatewayMock } from "./mocks/bet-gateway-mock";
import { BrokerSpy } from "./mocks/broker-spy";
import { MailerSpy } from "./mocks/mailer-spy";

export class TestConfigFactory {
  dependencies = {
    broker: new BrokerSpy(new InMemoryBroker()),
    martingaleRepository: new InMemoryMartingaleRepository(),
    playerRepository: new InMemoryPlayerRepository(),
    betGateway: new BetGatewayMock(),
    mailer: new MailerSpy(),
  };

  create() {
    registerHandlers(this.dependencies);
    this.dependencies.playerRepository.createDefaultPlayer();
    return this.dependencies;
  }
}
