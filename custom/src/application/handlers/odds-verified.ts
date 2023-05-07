import moment from "moment";
import { MakeBet } from "../../domain/commands/make-bet";
import { VerifyOdds } from "../../domain/commands/verify-odds";
import { Bet } from "../../domain/entities/bet";
import { MatchStatus } from "../../domain/entities/match";
import { Strategy } from "../../domain/entities/strategy";
import { OddsVerified } from "../../domain/events/odds-verified";
import { Broker } from "../ports/brokers/broker";
import { MatchRepository } from "../ports/repositories/match";
import { RuleRepository } from "../ports/repositories/rule";
import { Handler } from "./handler";

type Dependencies = {
  ruleRepository: RuleRepository;
  matchRepository: MatchRepository;
  broker: Broker;
};

export class OddsVerifiedHandler implements Handler {
  name = "odds-verified";

  private broker: Broker;
  private matchRepository: MatchRepository;
  private ruleRepository: RuleRepository;

  constructor(input: Dependencies) {
    this.ruleRepository = input.ruleRepository;
    this.matchRepository = input.matchRepository;
    this.broker = input.broker;
  }

  async handle(event: OddsVerified): Promise<void> {
    const { payload } = event;
    const match = await this.matchRepository.findById(payload.match.id);
    if (match.status === MatchStatus.FINISHED) return;
    const rule = await this.ruleRepository.findById(match.ruleId);
    const matchStrategy = new Strategy({ rule: rule.string, match });
    const { shouldBet, bet } = matchStrategy.verify(payload.odds);
    if (shouldBet) {
      await this.broker.publish(
        new MakeBet(
          new Bet({
            id: bet.id,
            strategy: { id: rule.id, name: rule.string },
            value: rule.value,
            playerId: rule.playerId,
            odd: bet.odd,
          })
        )
      );
    } else {
      const fiveMinutesLater = moment().add(5, "minutes").toDate();
      await this.broker.schedule(new VerifyOdds(payload.match), fiveMinutesLater);
    }
  }
}
