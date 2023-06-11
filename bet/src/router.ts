import { ACLController } from "./application/controllers/acl";
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

app.get("/matches/today/upcoming", ExpressAdapter.route(ACLController.listUpcomingMatchesForToday));
app.get("/matches/:matchId/markets", ExpressAdapter.route(ACLController.listMatchMarkets));
app.get("/markets/:marketId/odds", ExpressAdapter.route(ACLController.listMarketOdds));


export { app };
