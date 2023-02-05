import { BetGatewayMock } from "../../utils/mocks/bet-gateway-mock";
import { BrokerSpy } from "../../utils/mocks/broker-spy";
import { InMemoryBroker } from "../../../src/infra/brokers/in-memory";
import { InMemoryPlayerRepository } from "../../../src/infra/repositories/in-memory-player";
import { MakeBet } from "../../../src/application/usecases/make-bet";

test("It should be able to make a bet and debit from player account", async () => {
  const broker = new InMemoryBroker();
  const betGateway = new BetGatewayMock();
  const playerRepository = new InMemoryPlayerRepository();
  playerRepository.createDefaultPlayer();

  const sut = new MakeBet({ betGateway, playerRepository, broker });
  const input = { playerId: "default", betValue: 100, betId: "some-bet-id" };
  await sut.execute(input);

  const player = await await playerRepository.findById("default");
  expect(betGateway.betValue).toBe(100);
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

  expect(brokerSpy.events.length).toBe(1);
  expect(brokerSpy.events[0].name).toBe("bet-made");
});
