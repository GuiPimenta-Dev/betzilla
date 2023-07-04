import { HttpSuccess } from "./http-success";

export class Success extends HttpSuccess {
  constructor(readonly data?: any) {
    super(200, data);
  }
}
