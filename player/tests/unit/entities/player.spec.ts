import { Player } from "../../../src/domain/entities/player";

test("It should create an account when creating a new player", async () => {
  const player = new Player({ id: "id", email: "email", balance: 0 });

  expect(player.account.getBalance()).toBe(0);
});
