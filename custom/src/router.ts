import { CustomController } from "./application/controllers/custom";
import { ExpressAdapter } from "./infra/http/express-adapter";

const app = ExpressAdapter.create();

app.post("/custom", ExpressAdapter.route(CustomController.startOver05HT));

export { app };
