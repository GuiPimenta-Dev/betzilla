import { BetController } from "./application/controllers/bet";
import { ExpressAdapter } from "./infra/http/express-adapter";

const app = ExpressAdapter.create();

app.get("/matches/today/upcoming", ExpressAdapter.route(BetController.listUpcomingMatchesForToday));
app.get("/matches/markets", ExpressAdapter.route(BetController.listMatchMarkets));

export { app };
