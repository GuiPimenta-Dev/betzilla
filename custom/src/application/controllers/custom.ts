import { config } from "../../config";
import { Success } from "../../infra/http/status/success";
import { HttpInput } from "../ports/http/http-input";
import { StartCustomStrategy } from "../usecases/start-custom-strategy";

export class CustomController {
  static async startCustomStrategy(input: HttpInput): Promise<Success> {
    const { body } = input;
    const usecase = new StartCustomStrategy(config);
    const response = await usecase.execute(body);
    return new Success(response);
  }
}
