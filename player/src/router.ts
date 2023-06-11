import { PlayerController } from "./application/controllers/player";
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

app.get("/player/:playerId/balance", ExpressAdapter.route(PlayerController.getBalance));
app.post("/player/signup", ExpressAdapter.route(PlayerController.signup));
app.post("/player/login", ExpressAdapter.route(PlayerController.login));

export { app };
