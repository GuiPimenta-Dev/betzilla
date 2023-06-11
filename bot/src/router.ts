import { BotController } from "./application/controllers/bot";
import { MatchController } from "./application/controllers/match";
import { ExpressAdapter } from "./infra/http/express-adapter";

const app = ExpressAdapter.create();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Allow all origins
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.post("/bots/:name", ExpressAdapter.route(BotController.create));
app.get("/bots/:botId", ExpressAdapter.route(BotController.get));

app.get("/matches/:matchId", ExpressAdapter.route(MatchController.get));

export { app };
