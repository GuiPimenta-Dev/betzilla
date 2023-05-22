import moment from "moment";
import { config } from "../../config";
import { Success } from "../../infra/http/status/success";
import { HttpInput } from "../ports/http/http-input";
import { ListMatchMarkets } from "../usecases/list-match-markets";
import { ListUpcomingMatchesForToday } from "../usecases/list-upcoming-matches-for-today";

export class ACLController {
  static async listUpcomingMatchesForToday(): Promise<Success> {
    const usecase = new ListUpcomingMatchesForToday(config);
    const now = moment();
    const response = await usecase.execute(now);
    return new Success(response);
  }

  static async listMatchMarkets(input: HttpInput): Promise<Success> {
    const { path } = input;
    const usecase = new ListMatchMarkets(config);
    const response = await usecase.execute(path.matchId);
    return new Success(response);
  }

  static async listMarketOdds(input: HttpInput): Promise<Success> {
    const { path } = input;
    const response = await config.betGateway.listMarketOdds(path.marketId);
    return new Success(response);
  }
}
