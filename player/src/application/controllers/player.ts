import moment from "moment";
import { config } from "../../config";
import { Success } from "../../infra/http/status/success";
import { HttpInput } from "../ports/http/http-input";
import GetBalance from "../usecases/get-balance";
import { ListUpcomingMatchesForToday } from "../usecases/list-upcoming-matches-for-today";

export class PlayerController {
  static async getBalance(input: HttpInput): Promise<Success> {
    const { path } = input;
    const usecase = new GetBalance(config);
    const response = await usecase.execute(path.playerId);
    return new Success(response);
  }

  static async listUpcomingMatchesForToday(): Promise<Success> {
    const usecase = new ListUpcomingMatchesForToday(config);
    const now = moment();
    const response = await usecase.execute(now);
    return new Success(response);
  }
}
