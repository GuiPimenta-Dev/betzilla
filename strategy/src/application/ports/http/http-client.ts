import { HttpOutput } from "./http-output";

export interface HttpClient {
  get(url: string, query?: any, headers?: any): Promise<HttpOutput>;
  post(url: string, body: any, headers?: any): Promise<HttpOutput>;
}
