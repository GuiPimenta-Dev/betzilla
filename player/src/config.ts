import { InMemoryPlayerRepository } from '../../martingale/src/infra/repositories/in-memory-player';
import { InMemoryBroker } from "./infra/brokers/in-memory";
import { FakeBetGateway } from "./infra/gateways/bet-gateway";

function registerHandlers(dependencies) {
  const handlers = [

  ];
  handlers.forEach((handler) => dependencies.broker.register(handler));
}

const dependencies = {
  broker: new InMemoryBroker(),
  playerRepository: new InMemoryPlayerRepository(),
  betGateway: new FakeBetGateway(),
};

export const config = registerHandlers(dependencies);
