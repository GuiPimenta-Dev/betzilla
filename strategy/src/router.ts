import { MatchController } from "./application/controllers/match";
import { StrategyController } from "./application/controllers/strategy";
import { ExpressAdapter } from "./infra/http/express-adapter";

const app = ExpressAdapter.create();

app.post("/strategy", ExpressAdapter.route(StrategyController.start));
app.get("/strategies/:strategyId", ExpressAdapter.route(StrategyController.get));
app.get("/matches/:matchId", ExpressAdapter.route(MatchController.get));

export { app };
