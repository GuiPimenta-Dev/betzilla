import { pbkdf2, randomBytes } from "crypto";

import { BadRequest } from "../../infra/http/status/bad-request";

export class Password {
  private constructor(readonly value: string, readonly salt: string) {}

  static create(password: string, salt?: string): Promise<Password> {
    if (password.length < 8) throw new BadRequest("Invalid password");
    const generatedSalt = salt || randomBytes(20).toString("hex");
    return new Promise((resolve) => {
      pbkdf2(password, generatedSalt, 100, 64, "sha512", (error, value) => {
        resolve(new Password(value.toString("hex"), generatedSalt));
      });
    });
  }

  async compare(plainPassword: string) {
    return new Promise((resolve) => {
      pbkdf2(plainPassword, this.salt, 100, 64, "sha512", (error, value) => {
        resolve(this.value === value.toString("hex"));
      });
    });
  }
}
