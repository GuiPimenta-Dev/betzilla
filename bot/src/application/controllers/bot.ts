import { config } from "../../config";
import { BadRequest } from "../../infra/http/status/bad-request";
import { Success } from "../../infra/http/status/success";
import { HttpInput } from "../ports/http/http-input";
import { CreateBot } from "../usecases/create-bot";
import { GetBot } from "../usecases/get-bot";

const AVAILABLE_BOT_NAMES = ["player-rules", "pev"];

export class BotController {
  static async create(input: HttpInput): Promise<Success> {
    const { body, path } = input;
    if (!AVAILABLE_BOT_NAMES.includes(path.name)) throw new BadRequest("Invalid bot name");
    body.bot.name = path.name;
    const usecase = new CreateBot(config);
    const response = await usecase.execute(body);
    return new Success(response);
  }

  static async get(input: HttpInput): Promise<Success> {
    const { path } = input;
    const usecase = new GetBot(config);
    const response = await usecase.execute(path.botId);
    return new Success(response);
  }
}
