import { config } from "../../config";
import { BadRequest } from "../../infra/http/status/bad-request";
import { Created } from "../../infra/http/status/created";
import { Success } from "../../infra/http/status/success";
import { HttpInput } from "../ports/http/http-input";
import { CreateBot } from "../usecases/create-bot";
import { DeleteBot } from "../usecases/delete-bot";
import { GetBot } from "../usecases/get-bot";
import { ListBots } from "../usecases/list-bots";
import { PauseBot } from "../usecases/pause-bot";
import { ResumeBot } from "../usecases/resume-bot";
import { UpdateBot } from "../usecases/update-bot";

const AVAILABLE_BOT_NAMES = ["player-rules", "pev"];

export class BotController {
  static async create(input: HttpInput): Promise<Success> {
    const { body, path, headers } = input;
    if (!AVAILABLE_BOT_NAMES.includes(path.name)) throw new BadRequest("Invalid bot name");
    body.bot.name = path.name;
    body.bot.playerId = headers.playerId;
    const usecase = new CreateBot(config);
    const response = await usecase.execute(body);
    return new Created(response);
  }

  static async get(input: HttpInput): Promise<Success> {
    const { path } = input;
    const usecase = new GetBot(config);
    const response = await usecase.execute(path.botId);
    return new Success(response);
  }

  static async list(input: HttpInput): Promise<Success> {
    const { path } = input;
    const usecase = new ListBots(config);
    const response = await usecase.execute(path.playerId);
    return new Success(response);
  }

  static async update(input: HttpInput): Promise<Success> {
    const { body, headers } = input;
    const usecase = new UpdateBot(config);
    const response = await usecase.execute({ bot: body, playerId: headers.playerId });
    return new Success(response);
  }

  static async delete(input: HttpInput): Promise<Success> {
    const { path, headers } = input;
    const usecase = new DeleteBot(config);
    const response = await usecase.execute({ botId: path.botId, playerId: headers.playerId });
    return new Success(response);
  }

  static async pause(input: HttpInput): Promise<Success> {
    const { path, headers } = input;
    const usecase = new PauseBot(config);
    const response = await usecase.execute({ botId: path.botId, playerId: headers.playerId });
    return new Success(response);
  }

  static async resume(input: HttpInput): Promise<Success> {
    const { path, headers } = input;
    const usecase = new ResumeBot(config);
    const response = await usecase.execute({ botId: path.botId, playerId: headers.playerId });
    return new Success(response);
  }
}
