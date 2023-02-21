import { ExpressAdapter } from "./infra/http/express-adapter";

const app = ExpressAdapter.create();

export { app };
