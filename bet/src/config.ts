import { MakeBetHandler } from "./application/handlers/make-bet";
import { VerifyBetHandler } from "./application/handlers/verify-bet";
import { VerifyOddsHandler } from "./application/handlers/verify-odds";
import { RabbitMQAdapter } from "./infra/brokers/rabbitmq-adapter";
import { FotMobAdapter } from "./infra/gateways/fotmob-adapter";
import { AxiosAdapter } from "./infra/http/axios-adapter";

let config;
async function init() {
  const httpClient = new AxiosAdapter();
  const betGateway = new FotMobAdapter(httpClient);
  config = {
    broker: new RabbitMQAdapter(),
    betGateway,
    httpClient: new AxiosAdapter(),
  };
  await config.broker.connect();
  const handlers = [new MakeBetHandler(config)];
  handlers.map((handler) => {
    config.broker.subscribe(handler, async function (msg: any) {
      await handler.handle(msg);
    });
  });
  const delayedHandlers = [new VerifyOddsHandler(config), new VerifyBetHandler(config)];
  delayedHandlers.map((handler) => {
    config.broker.subscribeDelayed(handler, async function (msg: any) {
      await handler.handle(msg);
    });
  });
}
init();
export { config };
