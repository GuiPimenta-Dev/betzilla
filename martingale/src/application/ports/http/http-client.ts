interface HttpOutput {
  statusCode: number;
  data: any;
}

export interface HttpClient {
  get(url: string, query?: any, headers?: any): Promise<HttpOutput>;
}
