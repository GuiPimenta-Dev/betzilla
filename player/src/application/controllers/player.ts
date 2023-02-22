import { config } from "../../config";
import { Success } from "../../infra/http/status/success";
import { HttpInput } from "../ports/http/http-input";
import GetBalance from "../usecases/get-balance";
import { ListTodayUpcomingMatches } from "../usecases/list-available-matches-for-today";

export class PlayerController {
  static async getBalance(input: HttpInput): Promise<Success> {
    const { path } = input;
    const usecase = new GetBalance(config);
    const response = await usecase.execute(path.playerId);
    return new Success(response);
  }

  static async listNotStartedMatchesForToday(): Promise<Success> {
    const usecase = new ListTodayUpcomingMatches(config);
    const response = await usecase.execute();
    return new Success(response);
  }
}
