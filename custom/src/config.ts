import AxiosAdapter from "./infra/http/axios-adapter";
import { Handler } from "./application/handlers/handler";
import { InMemoryMatchRepository } from "./infra/repositories/in-memory-match";
import { InMemoryStrategyRepository } from "./infra/repositories/in-memory-strategy";
import { RabbitMQAdapter } from "./infra/brokers/rabbitmq-adapter";
import { StrategyStartedHandler } from "./application/handlers/strategy-started";

let config;
async function init() {
  config = {
    httpClient: new AxiosAdapter(),
    broker: new RabbitMQAdapter(),
    strategyRepository: new InMemoryStrategyRepository(),
    matchRepository: new InMemoryMatchRepository(),
  };
  await config.broker.connect();
  const handlers: Handler[] = [new StrategyStartedHandler(config)];
  handlers.map((handler) => {
    config.broker.subscribe(handler, async function (msg: any) {
      await handler.handle(msg);
    });
  });
}
init();
export { config };
