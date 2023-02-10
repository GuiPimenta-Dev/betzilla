import { HttpSuccess } from "./http-success";

export class Created extends HttpSuccess {
  constructor(readonly data?: any) {
    super(201, data);
  }
}
