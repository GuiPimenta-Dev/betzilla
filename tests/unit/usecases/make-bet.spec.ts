import { DebitPlayerAccountHandler } from "../../../src/application/handlers/debit-player-account";
import { MakeBet } from "../../../src/application/usecases/make-bet";
import { InMemoryBroker } from "../../../src/infra/brokers/in-memory";
import { InMemoryPlayerRepository } from "../../../src/infra/repositories/in-memory-player";
import { BetGatewayMock } from "../../utils/mocks/bet-gateway-mock";
import { BrokerSpy } from "../../utils/mocks/broker-spy";

let betGatewayMock: BetGatewayMock;
let playerRepository: InMemoryPlayerRepository;
let brokerSpy: BrokerSpy;
beforeEach(() => {
  brokerSpy = new BrokerSpy(new InMemoryBroker());
  playerRepository = new InMemoryPlayerRepository();
  playerRepository.createDefaultPlayer();
  betGatewayMock = new BetGatewayMock();
  const handlers = [new DebitPlayerAccountHandler({ playerRepository, broker: brokerSpy })];
  handlers.forEach((handler) => brokerSpy.register(handler));
});

test("It should be able to make a bet and debit from player account", async () => {
  const sut = new MakeBet({ broker: brokerSpy, betGateway: betGatewayMock });
  const input = { playerId: "default", betValue: 100, betId: "some-bet-id" };
  await sut.execute(input);

  const player = await playerRepository.findById("default");
  expect(betGatewayMock.betValue).toBe(100);
  expect(player.account.getBalance()).toBe(900);
});

test("It should emit an event when a bet is made", async () => {
  const sut = new MakeBet({ broker: brokerSpy, betGateway: betGatewayMock });
  const input = { playerId: "default", betValue: 100, betId: "some-bet-id" };
  await sut.execute(input);

  expect(brokerSpy.commands.length).toBe(1);
  expect(brokerSpy.commands[0].name).toBe("debit-player-account");
});

test("It should throw an error if bet was not made", async () => {
  betGatewayMock.mockMakeBetResponse(false);

  const sut = new MakeBet({ broker: brokerSpy, betGateway: betGatewayMock });
  const input = { playerId: "default", betValue: 100, betId: "some-bet-id" };
  await expect(sut.execute(input)).rejects.toThrowError("Bet was not made");
});
