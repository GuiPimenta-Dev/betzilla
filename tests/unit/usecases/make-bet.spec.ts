import { BetMadeHandler } from "../../../src/application/handlers/martingale/bet-made";
import { DebitAccountHandler } from "../../../src/application/handlers/player/debit-account";
import { MakeBet } from "../../../src/application/usecases/player/make-bet";
import { InMemoryBroker } from "../../../src/infra/brokers/in-memory";
import { InMemoryMartingaleRepository } from "../../../src/infra/repositories/in-memory-martingale";
import { InMemoryPlayerRepository } from "../../../src/infra/repositories/in-memory-player";
import { BetGatewayMock } from "../../utils/mocks/bet-gateway-mock";
import { BrokerSpy } from "../../utils/mocks/broker-spy";

let betGatewayMock: BetGatewayMock;
let playerRepository: InMemoryPlayerRepository;
let brokerSpy: BrokerSpy;
beforeEach(() => {
  brokerSpy = new BrokerSpy(new InMemoryBroker());
  const martingaleRepository = new InMemoryMartingaleRepository();
  playerRepository = new InMemoryPlayerRepository();
  playerRepository.createDefaultPlayer();
  betGatewayMock = new BetGatewayMock();
  const handlers = [
    new BetMadeHandler({ martingaleRepository, broker: brokerSpy }),
    new DebitAccountHandler({ playerRepository, broker: brokerSpy }),
  ];
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
  expect(brokerSpy.commands[0].name).toBe("debit-account");
});

test("It should throw an error if bet was not made", async () => {
  betGatewayMock.mockMakeBetResponse(false);

  const sut = new MakeBet({ broker: brokerSpy, betGateway: betGatewayMock });
  const input = { playerId: "default", betValue: 100, betId: "some-bet-id" };
  await expect(sut.execute(input)).rejects.toThrowError("Bet was not made");
});
