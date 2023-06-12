import express from "express";
import { HttpError } from "./status/http-error";

export class ExpressAdapter {
  static create() {
    const app = express();
    app.use(express.json());
    app.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });

    return app;
  }

  static route(fn) {
    return async function (req, res) {
      try {
        const { query, body, headers, params, file } = req;
        const output = await fn({ query, body, headers, path: params, file });
        res.status(output.statusCode).json(output.data);
      } catch (e) {
        if (e instanceof HttpError) {
          return res.status(e.statusCode).json({ message: e.message });
        }
        res.status(500).json({ message: e.message });
      }
    };
  }
}
