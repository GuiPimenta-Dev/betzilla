import { v4 as uuid } from "uuid";
import { config } from "../../config";
import { HttpSuccess } from "../../infra/http/status/http-success";
import { Success } from "../../infra/http/status/success";
import { HttpInput } from "../ports/http/http-input";
import { GetMartingaleHistory } from "../usecases/get-martingale-history";
import { StartMartingale } from "../usecases/start-martingale";

export class MartingaleController {
  static async start(input: HttpInput): Promise<HttpSuccess> {
    const { body } = input;
    const usecase = new StartMartingale(config);
    const output = await usecase.execute({ ...body, martingaleId: uuid() });
    return new Success(output);
  }

  static async history(input: HttpInput): Promise<HttpSuccess> {
    const { path } = input;
    const usecase = new GetMartingaleHistory(config);
    const output = await usecase.execute(path.id);
    return new Success(output);
  }
}
