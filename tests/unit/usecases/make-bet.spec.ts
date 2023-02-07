import { MakeBet } from "../../../src/application/usecases/make-bet";
import { InMemoryPlayerRepository } from "../../../src/infra/repositories/in-memory-player";
import { BetGatewayMock } from "../../utils/mocks/bet-gateway-mock";
import { BrokerSpy } from "../../utils/mocks/broker-spy";
import { TestConfigFactory } from "../../utils/test-config-factory";

test("It should be able to make a bet and debit from player account", async () => {
  const config = new TestConfigFactory().create();

  const sut = new MakeBet({ ...config });
  const input = { playerId: "default", betValue: 100, betId: "some-bet-id" };
  await sut.execute(input);

  const player = await config.playerRepository.findById("default");
  expect(config.betGateway.betValue).toBe(100);
  expect(player.account.getBalance()).toBe(900);
});

test("It should emit an event when a bet is made", async () => {
  const brokerSpy = new BrokerSpy();
  const betGateway = new BetGatewayMock();
  const playerRepository = new InMemoryPlayerRepository();
  playerRepository.createDefaultPlayer();

  const sut = new MakeBet({ betGateway, playerRepository, broker: brokerSpy });
  const input = { playerId: "default", betValue: 100, betId: "some-bet-id" };
  await sut.execute(input);

  expect(brokerSpy.commands.length).toBe(1);
  expect(brokerSpy.commands[0].name).toBe("debit-player-account");
});
