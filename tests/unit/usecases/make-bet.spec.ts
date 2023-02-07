import { MakeBet } from "../../../src/application/usecases/make-bet";
import { TestConfigFactory } from "../../utils/test-config-factory";

test("It should be able to make a bet and debit from player account", async () => {
  const config = new TestConfigFactory().create();

  const sut = new MakeBet(config);
  const input = { playerId: "default", betValue: 100, betId: "some-bet-id" };
  await sut.execute(input);

  const player = await config.playerRepository.findById("default");
  expect(config.betGateway.betValue).toBe(100);
  expect(player.account.getBalance()).toBe(900);
});

test("It should emit an event when a bet is made", async () => {
  const config = new TestConfigFactory().create();

  const sut = new MakeBet(config);
  const input = { playerId: "default", betValue: 100, betId: "some-bet-id" };
  await sut.execute(input);

  expect(config.broker.commands.length).toBe(1);
  expect(config.broker.commands[0].name).toBe("debit-player-account");
});

test("It should throw an error if bet was not made", async () => {
  const config = new TestConfigFactory().create();
  config.betGateway.mockMakeBetResponse(false);

  const sut = new MakeBet(config);
  const input = { playerId: "default", betValue: 100, betId: "some-bet-id" };
  await expect(sut.execute(input)).rejects.toThrowError("Bet was not made");
});
