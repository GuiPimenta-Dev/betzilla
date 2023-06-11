import { BadRequest } from "../../infra/http/status/bad-request";
import { Account } from "./account";
import { Password } from "./password";

type Input = {
  id: string;
  name: string;
  password: Password;
  email: string;
  balance: number;
};

export class Player {
  id: string;
  name: string;
  password: Password;
  email: string;
  readonly account: Account;

  constructor(input: Input) {
    this.validate(input);
    this.id = input.id;
    this.name = input.name;
    this.password = input.password;
    this.email = input.email;
    this.account = new Account({ balance: input.balance });
  }

  private validate(input: Input) {
    if (input.name.length < 5) throw new BadRequest("Invalid name");
    if (
      !String(input.email)
        .toLowerCase()
        .match(/^[\w-]+(\.[\w-]+)*@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/)
    ) {
      throw new BadRequest("Invalid email");
    }
  }

  async validatePassword(password: string) {
    return this.password.compare(password);
  }
}
