import { AxiosAdapter } from "./infra/http/axios-adapter";
import { FakeBetGateway } from "./infra/gateways/bet-gateway";
import { MakeBetHandler } from "./application/handlers/make-bet";
import { RabbitMQAdapter } from "./infra/brokers/rabbitmq-adapter";
import { VerifyBetHandler } from "./application/handlers/verify-bet";
import { VerifyOddsHandler } from "./application/handlers/verify-odds";

let config;
async function init() {
  // const httpClient = new AxiosAdapter();
  // const betGateway = new BetFairProxy(new BetFairAdapter(httpClient));
  // await betGateway.login();
  const betGateway = new FakeBetGateway();
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
