import { BetLostHandler } from "./application/handlers/bet-lost";
import { BetMadeHandler } from "./application/handlers/bet-made";
import { BetNotMadeHandler } from "./application/handlers/bet-not-made";
import { BetVerifiedHandler } from "./application/handlers/bet-verified";
import { BetWonHandler } from "./application/handlers/bet-won";
import { MakeMartingaleBetHandler } from "./application/handlers/make-martingale-bet";
import { MartingaleFinishedHandler } from "./application/handlers/martingale-finished";
import { UpdateHistoryOnBetLostHandler } from "./application/handlers/update-history-on-bet-lost";
import { UpdateHistoryOnBetWonHandler } from "./application/handlers/update-history-on-bet-won";
import { RabbitMQAdapter } from "./infra/brokers/rabbitmq-adapter";
import AxiosAdapter from "./infra/http/axios-adapter";
import { InMemoryMartingaleRepository } from "./infra/repositories/in-memory-martingale";

let config;
async function init() {
  config = {
    broker: new RabbitMQAdapter(),
    martingaleRepository: new InMemoryMartingaleRepository(),
    httpClient: new AxiosAdapter(),
  };
  await config.broker.connect();
  const handlers = [
    new BetLostHandler(config),
    new BetWonHandler(config),
    new BetMadeHandler(config),
    new BetVerifiedHandler(config),
    new MakeMartingaleBetHandler(config),
    new MartingaleFinishedHandler(config),
    new UpdateHistoryOnBetLostHandler(config),
    new UpdateHistoryOnBetWonHandler(config),
    new BetNotMadeHandler(config),
  ];
  handlers.map((handler) => {
    config.broker.subscribe(handler, async function (msg: any) {
      await handler.handle(msg);
    });
  });
}
init();

export { config };
