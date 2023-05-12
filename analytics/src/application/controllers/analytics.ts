import { config } from "../../config";
import { Success } from "../../infra/http/status/success";
import { HttpInput } from "../ports/http/http-input";
import { GetStrategyAnalytics } from "../usecases/get-strategy-analytics";

export class AnalyticsController {
  static async get(input: HttpInput): Promise<Success> {
    const { path } = input;
    const usecase = new GetStrategyAnalytics(config);
    const response = await usecase.execute(path.strategyId);
    return new Success(response);
  }
}
