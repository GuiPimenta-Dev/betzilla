import { BetMadeHandler } from "./application/handlers/bet-made";
import { BotCreatedHandler } from "./application/handlers/bot-created";
import { HalfTimeFinishedHandler } from "./application/handlers/half-time-finished";
import { Handler } from "./application/handlers/handler";
import { MatchFinishedHandler } from "./application/handlers/match-finished";
import { MatchStartedHandler } from "./application/handlers/match-started";
import { OddsVerifiedHandler } from "./application/handlers/odds-verified";
import { RabbitMQAdapter } from "./infra/brokers/rabbitmq-adapter";
import AxiosAdapter from "./infra/http/axios-adapter";
import { InMemoryBotRepository } from "./infra/repositories/in-memory-bot";
import { InMemoryMatchRepository } from "./infra/repositories/in-memory-match";
import { DevelopmentScheduler } from "./infra/scheduler/development";

let config;
async function init() {
  config = {
    httpClient: new AxiosAdapter(),
    broker: new RabbitMQAdapter(),
    botRepository: new InMemoryBotRepository(),
    matchRepository: new InMemoryMatchRepository(),
    scheduler: new DevelopmentScheduler(),
  };
  await config.broker.connect();
  const handlers: Handler[] = [
    new BotCreatedHandler(config),
    new OddsVerifiedHandler(config),
    new BetMadeHandler(config),
  ];
  handlers.map((handler) => {
    config.broker.subscribe(handler, async function (msg: any) {
      await handler.handle(msg);
    });
  });
  const delayedHandlers = [
    new MatchStartedHandler(config),
    new HalfTimeFinishedHandler(config),
    new MatchFinishedHandler(config),
  ];
  delayedHandlers.map((handler) => {
    config.broker.subscribeDelayed(handler, async function (msg: any) {
      await handler.handle(msg);
    });
  });
}
init();
export { config };
