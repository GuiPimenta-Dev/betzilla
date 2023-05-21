import { HttpClient } from "../../../src/application/ports/http/http-client";
import { HttpOutput } from "../../../src/application/ports/http/http-output";

export class FakeHttpClient implements HttpClient {
  getResponse: any = { statusCode: 200, data: { balance: 1000 } };
  url = {};

  async get(url: string): Promise<HttpOutput> {
    if (this.url) return this.url[url];
    return this.getResponse;
  }

  post(url: string, body: any, headers?: any): Promise<HttpOutput> {
    throw new Error("Method not implemented.");
  }

  mockGet(response: HttpOutput): void {
    this.getResponse = response;
  }

  mockURL(url: string, data: HttpOutput): void {
    this.url[url] = data;
  }
}
