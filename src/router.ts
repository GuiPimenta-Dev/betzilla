import { MartingaleController } from "./application/controllers/martingale";
import { ExpressAdapter } from "./infra/http/express-adapter";

const app = ExpressAdapter.create();

app.post("/martingale", ExpressAdapter.route(MartingaleController.start));
app.get("/martingale/:id/history", ExpressAdapter.route(MartingaleController.history));

export { app };
