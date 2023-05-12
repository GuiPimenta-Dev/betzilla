import { BetGateway } from "../ports/gateways/bet";
import { BetMade } from "../../domain/events/bet-made";
import { BetNotMade } from "../../domain/events/bet-not-made";
import { Broker } from "../ports/brokers/broker";
import { HttpClient } from "../ports/http/http-client";
import { MakeBet } from "../../domain/commands/make-bet";

type Dependencies = {
  betGateway: BetGateway;
  broker: Broker;
  httpClient: HttpClient;
};

export class MakeBetHandler {
  name = "make-bet";
  private broker: Broker;
  private betGateway: BetGateway;
  private httpClient: HttpClient;

  constructor(input: Dependencies) {
    this.betGateway = input.betGateway;
    this.broker = input.broker;
    this.httpClient = input.httpClient;
  }

  async handle(input: MakeBet) {
    const { marketId, oddId, type, odd, betValue, playerId, matchId } = input.payload;
    const { data } = await this.httpClient.get(`http://player:3000/player/${playerId}/balance`);
    if (data.balance < betValue) {
      await this.broker.publish(new BetNotMade({ matchId, playerId, betValue, reason: "insufficient funds" }));
      return;
    }
    const { success, betId } = await this.betGateway.makeBet({ marketId, oddId, type, odd, betValue });
    if (!success) {
      await this.broker.publish(
        new BetNotMade({ matchId, playerId, betValue, reason: "Betfair could not proccess the request" })
      );
      return;
    }
    await this.broker.publish(new BetMade({ matchId, betId, playerId, betValue }));
  }
}
