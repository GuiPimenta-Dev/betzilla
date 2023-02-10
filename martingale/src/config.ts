import { MakeBetFake } from "../tests/utils/mocks/make-bet-fake";
import { VerifyBetFake } from "../tests/utils/mocks/verify-bet-fake";
import { BetLostHandler } from "./application/handlers/bet-lost";
import { BetMadeHandler } from "./application/handlers/bet-made";
import { BetVerifiedHandler } from "./application/handlers/bet-verified";
import { BetWonHandler } from "./application/handlers/bet-won";
import { MakeMartingaleBetHandler } from "./application/handlers/make-martingale-bet";
import { MartingaleFinishedHandler } from "./application/handlers/martingale-finished";
import { UpdateHistoryOnBetLostHandler } from "./application/handlers/update-history-on-bet-lost";
import { UpdateHistoryOnBetWonHandler } from "./application/handlers/update-history-on-bet-won";
import { InMemoryBroker } from "./infra/brokers/in-memory";
import { InMemoryMartingaleRepository } from "./infra/repositories/in-memory-martingale";

function registerHandlers(dependencies) {
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
    new VerifyBetFake(dependencies),
    new MakeBetFake(dependencies),
  ];
  handlers.forEach((handler) => dependencies.broker.register(handler));
}

const dependencies = {
  broker: new InMemoryBroker(),
  martingaleRepository: new InMemoryMartingaleRepository(),
};

registerHandlers(dependencies);

export const config = dependencies;
