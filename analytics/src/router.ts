import { AnalyticsController } from "./application/controllers/analytics";
import { ExpressAdapter } from "./infra/http/express-adapter";

const app = ExpressAdapter.create();

app.get("/analytics/:strategyId", ExpressAdapter.route(AnalyticsController.get));

export { app };
