import { Handler } from "../../martingale/src/application/handlers/handler";
import { RabbitMQAdapter } from "./infra/brokers/rabbitmq-adapter";

let config;
async function init() {
  config = {
    broker: new RabbitMQAdapter(),
  };
  await config.broker.connect();
  const handlers: Handler[] = [];

  handlers.map((handler) => {
    config.broker.subscribe(handler, async function (msg: any) {
      await handler.handle(msg);
    });
  });
}
init();
export { config };
