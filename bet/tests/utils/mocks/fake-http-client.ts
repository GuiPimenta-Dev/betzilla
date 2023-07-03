import { HttpClient } from "../../../src/application/ports/http/http-client";
import { HttpOutput } from "../../../src/application/ports/http/http-output";

export class FakeHttpClient implements HttpClient {
  getResponse: any = { statusCode: 200, data: { balance: 1000 } };
  postResponse: any;
  urls = {};

  async get(url): Promise<HttpOutput> {
    if (this.urls[url]) {
      return this.urls[url];
    }
    return this.getResponse;
  }

  post(url: string, body: any, headers?: any): Promise<HttpOutput> {
    return this.postResponse;
  }

  mockGet(response: HttpOutput): void {
    this.getResponse = response;
  }

  mockPost(response: HttpOutput): void {
    this.postResponse = response;
  }

  mockGetIfUrlIs(url: string, response: HttpOutput): void {
    this.urls[url] = response;
  }
}
