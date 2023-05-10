import { BrokerSpy } from "../../utils/mocks/broker-spy";
import { FakeBetGateway } from "../../utils/mocks/fake-bet-gateway";
import { InMemoryBroker } from "../../../src/infra/brokers/in-memory";
import { MakeBet } from "../../../src/domain/commands/make-bet";
import { MakeBetHandler } from "../../../src/application/handlers/make-bet";

const bet = {
  matchId: "matchId",
  marketId: "marketId",
  playerId: "playerId",
  odd: 1.0,
  betValue: 100,
  oddId: "oddId",
  type: "type",
};

test("It should emit a bet made event after make the bet", async () => {
  const betGateway = new FakeBetGateway();
  const brokerSpy = new BrokerSpy(new InMemoryBroker());

  const makeBet = new MakeBet(bet);
  const sut = new MakeBetHandler({ betGateway, broker: brokerSpy });
  await sut.handle(makeBet);

  expect(brokerSpy.events[0].name).toBe("bet-made");
  expect(brokerSpy.events[0].payload).toEqual(
    expect.objectContaining({
      matchId: expect.any(String),
      betId: expect.any(String),
      playerId: expect.any(String),
      betValue: expect.any(Number),
    })
  );
});

test("It should throw an error if the bet was not made by the bet gateway", async () => {
  const brokerSpy = new BrokerSpy(new InMemoryBroker());
  const betGateway = new FakeBetGateway();
  betGateway.mockMakeBet(false);

  const makeBet = new MakeBet(bet);
  const sut = new MakeBetHandler({ betGateway, broker: brokerSpy });
  await expect(sut.handle(makeBet)).rejects.toThrow("Bet was not made");
});
