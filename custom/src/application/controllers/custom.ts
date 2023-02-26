import { config } from "../../config";
import { Success } from "../../infra/http/status/success";
import { HttpInput } from "../ports/http/http-input";
import { StartOver05HT } from "../usecases/start-over-05-ht";

export class CustomController {
  static async startOver05HT(input: HttpInput): Promise<Success> {
    const { body } = input;
    const usecase = new StartOver05HT(config);
    const response = await usecase.execute(body);
    return new Success(response);
  }
}
