import { BetLostHandler } from "./application/handlers/bet-lost";
import { BetMadeHandler } from "./application/handlers/bet-made";
import { BetWonHandler } from "./application/handlers/bet-won";
import { Handler } from "./application/handlers/handler";
import { RabbitMQAdapter } from "./infra/brokers/rabbitmq-adapter";
import AxiosAdapter from "./infra/http/axios-adapter";
import { InMemoryAnalyticsRepository } from "./infra/repositories/in-memory-analytics";

let config;
async function init() {
  config = {
    broker: new RabbitMQAdapter(),
    analyticsRepository: new InMemoryAnalyticsRepository(),
    httpClient: new AxiosAdapter(),
  };
  await config.broker.connect();
  const handlers: Handler[] = [new BetLostHandler(config), new BetWonHandler(config), new BetMadeHandler(config)];
  handlers.map((handler) => {
    config.broker.subscribe(handler, async function (msg: any) {
      await handler.handle(msg);
    });
  });
}
init();
export { config };
