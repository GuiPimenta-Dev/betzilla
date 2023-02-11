import { BetLostHandler } from "./application/handlers/bet-lost";
import { BetMadeHandler } from "./application/handlers/bet-made";
import { BetVerifiedHandler } from "./application/handlers/bet-verified";
import { BetWonHandler } from "./application/handlers/bet-won";
import { MakeMartingaleBetHandler } from "./application/handlers/make-martingale-bet";
import { MartingaleFinishedHandler } from "./application/handlers/martingale-finished";
import { UpdateHistoryOnBetLostHandler } from "./application/handlers/update-history-on-bet-lost";
import { UpdateHistoryOnBetWonHandler } from "./application/handlers/update-history-on-bet-won";
import { RabbitMQAdapter } from "./infra/brokers/rabbitmq-adapter";
import MartingaleConsumer from "./infra/consumer/martingale-consumer";
import { InMemoryMartingaleRepository } from "./infra/repositories/in-memory-martingale";

let config;
async function init() {
  const broker = new RabbitMQAdapter();
  await broker.connect();
  const dependencies = {
    broker,
    martingaleRepository: new InMemoryMartingaleRepository(),
  };
  const handlers = [
    new BetLostHandler(dependencies),
    new BetWonHandler(dependencies),
    new BetMadeHandler(dependencies),
    new BetVerifiedHandler(dependencies),
    new MakeMartingaleBetHandler(dependencies),
    new MartingaleFinishedHandler(dependencies),
    new UpdateHistoryOnBetLostHandler(dependencies),
    new UpdateHistoryOnBetWonHandler(dependencies),
    new MartingaleFinishedHandler(dependencies),
    // new VerifyBetFake(dependencies),
    // new MakeBetFake(dependencies),
  ];
  new MartingaleConsumer(broker, handlers);
  config = dependencies;
}

init();
export { config };
