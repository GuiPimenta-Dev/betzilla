import { config } from "../../config";
import { HttpSuccess } from "../../utils/http-status/http-success";
import { Success } from "../../utils/http-status/success";
import { HttpInput } from "../ports/http/http-input";
import { GetMartingaleHistory } from "../usecases/get-martingale-history";
import { StartMartingale } from "../usecases/start-martingale";

export class MartingaleController {
  static async start(input: HttpInput): Promise<HttpSuccess> {
    const { body } = input;
    const usecase = new StartMartingale({ ...config });
    const output = await usecase.execute(body);
    return new Success(output);
  }

  static async history(input: HttpInput): Promise<HttpSuccess> {
    const { path } = input;
    const usecase = new GetMartingaleHistory({ ...config });
    const output = await usecase.execute(path.id);
    return new Success(output);
  }
}
