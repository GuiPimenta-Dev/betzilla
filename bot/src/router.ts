import { BotController } from "./application/controllers/bot";
import { MatchController } from "./application/controllers/match";
import { ExpressAdapter } from "./infra/http/express-adapter";

const app = ExpressAdapter.create();

app.post("/bots/:name", ExpressAdapter.route(BotController.create));
app.get("/bots/:botId", ExpressAdapter.route(BotController.get));

app.get("/matches/:matchId", ExpressAdapter.route(MatchController.get));

export { app };
