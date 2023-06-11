import { config } from "../../config";
import { Created } from "../../infra/http/status/created";
import { Success } from "../../infra/http/status/success";
import { HttpInput } from "../ports/http/http-input";
import GetBalance from "../usecases/get-balance";
import { Login } from "../usecases/login";
import { Signup } from "../usecases/sign-up";

export class PlayerController {
  static async signup(input: HttpInput): Promise<Created> {
    const { body } = input;
    const usecase = new Signup(config);
    const response = await usecase.execute(body);
    return new Success(response);
  }

  static async login(input: HttpInput): Promise<Success> {
    const { body } = input;
    const usecase = new Login(config);
    const response = await usecase.execute(body);
    return new Success(response);
  }

  static async getBalance(input: HttpInput): Promise<Success> {
    const { path } = input;
    const usecase = new GetBalance(config);
    const response = await usecase.execute(path.playerId);
    return new Success(response);
  }
}
