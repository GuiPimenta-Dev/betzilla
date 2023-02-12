require("dotenv/config");

import { CreditAccountHandler } from "./application/handlers/credit-account";
import { DebitAccountHandler } from "./application/handlers/debit-account";
import { MakeBetHandler } from "./application/handlers/make-bet";
import { VerifyBetHandler } from "./application/handlers/verify-bet";
import { RabbitMQAdapter } from "./infra/brokers/rabbitmq-adapter";
import { FakeBetGateway } from "./infra/gateways/bet-gateway";
import { InMemoryPlayerRepository } from "./infra/repositories/in-memory-player";
import { app } from "./router";

async function init() {
  const config = {
    broker: new RabbitMQAdapter(),
    playerRepository: new InMemoryPlayerRepository(),
    betGateway: new FakeBetGateway(),
  };
  await config.broker.connect();
  config.playerRepository.createDefaultPlayer();
  const handlers = [
    new CreditAccountHandler(config),
    new DebitAccountHandler(config),
    new MakeBetHandler(config),
    new VerifyBetHandler(config),
  ];
  handlers.map((handler) => {
    config.broker.subscribe(handler, async function (msg: any) {
      await handler.handle(msg);
    });
  });
}
init();

app.listen(3000);
