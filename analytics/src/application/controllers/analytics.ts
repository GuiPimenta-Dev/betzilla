import { config } from "../../config";
import { Success } from "../../infra/http/status/success";
import { HttpInput } from "../ports/http/http-input";
import { GetBotAnalytics } from "../usecases/get-bot-analytics";

export class AnalyticsController {
  static async get(input: HttpInput): Promise<Success> {
    const { path } = input;
    const usecase = new GetBotAnalytics(config);
    const response = await usecase.execute(path.botId);
    return new Success(response);
  }
}
