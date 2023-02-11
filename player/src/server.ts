require("dotenv/config");

import { config } from "./config";
import { app } from "./router";

console.log(config);

app.listen(3000);
