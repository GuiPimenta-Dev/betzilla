import { HttpClient } from "../../application/ports/http/http-client";
import { HttpError } from "./status/http-error";
import { HttpOutput } from "../../application/ports/http/http-output";
import axios from "axios";

export class AxiosAdapter implements HttpClient {
  async get(url: string, query?: {}, headers?: {}): Promise<HttpOutput> {
    let response: any;
    try {
      response = await axios.get(url, { params: query, headers });
    } catch (error: any) {
      throw new HttpError(error.response.status, error.response.data);
    }
    return { statusCode: response.status, data: response.data };
  }

  async post(url: string, body: any, headers?: {}): Promise<HttpOutput> {
    const options = {
      method: "POST",
      url,
      headers,
      data: body,
    };
    let response: any;
    try {
      response = await axios.request(options);
    } catch (error: any) {
      throw new HttpError(error.response.status, error.response.data);
    }
    return { statusCode: response.status, data: response.data };
  }
}
