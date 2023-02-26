import { Handler } from "./application/handlers/handler";
import { StrategyStartedHandler } from "./application/handlers/strategy-started";
import { RabbitMQAdapter } from "./infra/brokers/rabbitmq-adapter";
import AxiosAdapter from "./infra/http/axios-adapter";
import { InMemoryStrategyRepository } from "./infra/repositories/in-memory-strategy";

let config;
async function init() {
  config = {
    httpClient: new AxiosAdapter(),
    broker: new RabbitMQAdapter(),
    strategyRepository: new InMemoryStrategyRepository(),
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
