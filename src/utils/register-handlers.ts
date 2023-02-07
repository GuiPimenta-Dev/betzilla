import { CreditPlayerAccountHandler } from "../application/handlers/credit-player-account";
import { DebitPlayerAccountHandler } from "../application/handlers/debit-player-account";
import { MakeBetHandler } from "../application/handlers/make-bet";
import { MakeMartingaleBetHandler } from "../application/handlers/make-martingale-bet";
import { MartingaleFinishedHandler } from "../application/handlers/martingale-finished";
import { MartingaleVerifiedHandler } from "../application/handlers/martingale-verified";
import { VerifyMartingaleHandler } from "../application/handlers/verify-martingale";
import { Broker } from "../application/ports/brokers/broker";
import { BetGateway } from "../application/ports/gateways/bet";
import { Mailer } from "../application/ports/gateways/mailer";
import { MartingaleRepository } from "../application/ports/repositories/martingale";
import { PlayerRepository } from "../application/ports/repositories/player";

type Dependencies = {
  broker: Broker;
  martingaleRepository: MartingaleRepository;
  playerRepository: PlayerRepository;
  betGateway: BetGateway;
  mailer: Mailer;
};

export function registerHandlers(dependencies: Dependencies) {
  const handlers = [
    new MakeMartingaleBetHandler({ ...dependencies }),
    new MakeBetHandler({ ...dependencies }),
    new DebitPlayerAccountHandler({ ...dependencies }),
    new VerifyMartingaleHandler({ ...dependencies }),
    new MartingaleVerifiedHandler({ ...dependencies }),
    new MartingaleFinishedHandler({ ...dependencies }),
    new CreditPlayerAccountHandler({ ...dependencies }),
  ];
  handlers.forEach((handler) => dependencies.broker.register(handler));
}
