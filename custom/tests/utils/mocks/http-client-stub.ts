import { HttpClient } from "../../../src/application/ports/http/http-client";
import { HttpOutput } from "../../../src/application/ports/http/http-output";

export class HttpClientStub implements HttpClient {
  getResponse: any = { statusCode: 200, data: { balance: 1000 } };

  async get(): Promise<HttpOutput> {
    return this.getResponse;
  }

  post(url: string, body: any, headers?: any): Promise<HttpOutput> {
    throw new Error("Method not implemented.");
  }

  mockGetResponse(response: HttpOutput): void {
    this.getResponse = response;
  }
}
