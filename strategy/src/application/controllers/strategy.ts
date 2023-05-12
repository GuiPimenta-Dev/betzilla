import { config } from "../../config";
import { Success } from "../../infra/http/status/success";
import { HttpInput } from "../ports/http/http-input";
import { GetStrategy } from "../usecases/get-strategy";
import { StartExecution } from "../usecases/start-execution";

export class StrategyController {
  static async start(input: HttpInput): Promise<Success> {
    const { body } = input;
    const usecase = new StartExecution(config);
    const response = await usecase.execute(body);
    return new Success(response);
  }

  static async get(input: HttpInput): Promise<Success> {
    const { path } = input;
    const usecase = new GetStrategy(config);
    const response = await usecase.execute(path.strategyId);
    return new Success(response);
  }
}
