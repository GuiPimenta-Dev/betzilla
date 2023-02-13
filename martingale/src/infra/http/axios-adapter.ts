import axios from "axios";
import { HttpClient } from "../../application/ports/http/http-client";
import { HttpOutput } from "../../application/ports/http/http-output";
import { HttpError } from "./status/http-error";

export default class AxiosAdapter implements HttpClient {
  async get(url: string, query?: {}, headers?: {}): Promise<HttpOutput> {
    let response: any;
    try {
      response = await axios.get(url, { params: query, headers });
    } catch (error: any) {
      console.log(error);
      throw new HttpError(error.response.status, error.response.data);
    }
    return { statusCode: response.status, data: response.data };
  }
}
