import { BotController } from "./application/controllers/bot";
import { MatchController } from "./application/controllers/match";
import { verifyToken } from "./application/middlewares/jwt";
import { ExpressAdapter } from "./infra/http/express-adapter";

const app = ExpressAdapter.create();

app.post("/bots/:name", verifyToken, ExpressAdapter.route(BotController.create));
app.get("/bots/:botId", ExpressAdapter.route(BotController.get));
app.get("/matches/:matchId", ExpressAdapter.route(MatchController.get));
app.get("/matches", ExpressAdapter.route(MatchController.list));
app.get("/bots", verifyToken, ExpressAdapter.route(BotController.list));
app.put("/bots/:botId", verifyToken, ExpressAdapter.route(BotController.update));
app.delete("/bots/:botId", verifyToken, ExpressAdapter.route(BotController.delete));
app.post("/bots/pause", verifyToken, ExpressAdapter.route(BotController.pause));
app.post("/bots/resume", verifyToken, ExpressAdapter.route(BotController.resume));

export { app };
