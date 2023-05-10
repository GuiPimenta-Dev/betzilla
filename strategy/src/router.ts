import { StrategyController } from "./application/controllers/strategy";
import { ExpressAdapter } from "./infra/http/express-adapter";

const app = ExpressAdapter.create();

app.post("/strategy", ExpressAdapter.route(StrategyController.start));

export { app };
