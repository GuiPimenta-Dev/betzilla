import { Handler } from "../../application/handlers/handler";
import { Broker } from "../../application/ports/brokers/broker";

export default class MartingaleConsumer {
  constructor(readonly broker: Broker, readonly handlers: Handler[]) {
    handlers.map((handler) => {
      broker.subscribe(handler, async function (msg: any) {
        await handler.handle(msg);
      });
    });
  }
}
