import { PlayerController } from "./application/controllers/player";
import { ExpressAdapter } from "./infra/http/express-adapter";

const app = ExpressAdapter.create();

app.get("/player/:playerId/balance", ExpressAdapter.route(PlayerController.getBalance));

export { app };
