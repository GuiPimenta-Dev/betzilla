import { config } from "../../config";
import { Success } from "../../infra/http/status/success";
import { HttpInput } from "../ports/http/http-input";
import { GetMatch } from "../usecases/get-match";

export class MatchController {
  static async get(input: HttpInput): Promise<Success> {
    const { path } = input;
    const usecase = new GetMatch(config);
    const response = await usecase.execute(path.matchId);
    return new Success(response);
  }
}
