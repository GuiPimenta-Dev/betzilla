import { AnalyticsController } from "./application/controllers/analytics";
import { verifyToken } from "./application/middlewares/jwt";
import { ExpressAdapter } from "./infra/http/express-adapter";

const app = ExpressAdapter.create();

app.get("/analytics/:botId", verifyToken, ExpressAdapter.route(AnalyticsController.get));

export { app };
