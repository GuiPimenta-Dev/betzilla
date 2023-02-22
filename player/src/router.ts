import { ExpressAdapter } from "./infra/http/express-adapter";
import { PlayerController } from "./application/controllers/player";

const app = ExpressAdapter.create();

app.get("/player/:playerId/balance", ExpressAdapter.route(PlayerController.getBalance));
app.get("/matches", ExpressAdapter.route(PlayerController.listMatches));

export { app };
