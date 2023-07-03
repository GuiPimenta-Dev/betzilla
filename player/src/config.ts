import { CreditAccountHandler } from "./application/handlers/credit-account";
import { DebitAccountHandler } from "./application/handlers/debit-account";
import { RabbitMQAdapter } from "./infra/brokers/rabbitmq-adapter";
import { InMemoryPlayerRepository } from "./infra/repositories/in-memory-player";

let config;
async function init() {
  config = {
    broker: new RabbitMQAdapter(),
    playerRepository: new InMemoryPlayerRepository(),
  };
  await config.broker.connect();
  config.playerRepository.createDefaultPlayer();
  const handlers = [new CreditAccountHandler(config), new DebitAccountHandler(config)];
  handlers.map((handler) => {
    config.broker.subscribe(handler, async function (msg: any) {
      await handler.handle(msg);
    });
  });
}
init();

export { config };
