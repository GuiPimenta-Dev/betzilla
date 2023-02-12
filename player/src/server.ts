require("dotenv/config");

import { CreditAccountHandler } from "./application/handlers/credit-account";
import { DebitAccountHandler } from "./application/handlers/debit-account";
import { MakeBetHandler } from "./application/handlers/make-bet";
import { VerifyBetHandler } from "./application/handlers/verify-bet";
import { RabbitMQAdapter } from "./infra/brokers/rabbitmq-adapter";
import { PlayerConsumer } from "./infra/consumers/player-consumer";
import { FakeBetGateway } from "./infra/gateways/bet-gateway";
import { InMemoryPlayerRepository } from "./infra/repositories/in-memory-player";
import { app } from "./router";

let config;
async function init() {
  const broker = new RabbitMQAdapter();
  await broker.connect();
  const playerRepository = new InMemoryPlayerRepository();
  const dependencies = {
    broker,
    playerRepository,
    betGateway: new FakeBetGateway(),
  };
  const handlers = [
    new CreditAccountHandler(dependencies),
    new DebitAccountHandler(dependencies),
    new MakeBetHandler(dependencies),
    new VerifyBetHandler(dependencies),
  ];
  new PlayerConsumer(broker, handlers);
  config = dependencies;
}

init();

app.listen(3000);
