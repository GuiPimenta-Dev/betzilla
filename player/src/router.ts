import { PlayerController } from "./application/controllers/player";
import { ExpressAdapter } from "./infra/http/express-adapter";

const app = ExpressAdapter.create();

app.get("/player/:playerId/balance", ExpressAdapter.route(PlayerController.getBalance));
app.get("/matches/today/upcoming", ExpressAdapter.route(PlayerController.listUpcomingMatchesForToday));
app.get("/matches/markets", ExpressAdapter.route(PlayerController.listMatchMarkets));

export { app };
