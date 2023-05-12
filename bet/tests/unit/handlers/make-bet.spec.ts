import { BrokerSpy } from "../../utils/mocks/broker-spy";
import { FakeBetGateway } from "../../utils/mocks/fake-bet-gateway";
import { FakeHttpClient } from "../../utils/mocks/fake-http-client";
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
  const httpClient = new FakeHttpClient();

  const makeBet = new MakeBet(bet);
  const sut = new MakeBetHandler({ betGateway, broker: brokerSpy, httpClient });
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

test("It should emit a bet not made event if the bet was not made by the bet gateway", async () => {
  const brokerSpy = new BrokerSpy(new InMemoryBroker());
  const betGateway = new FakeBetGateway();
  const httpClient = new FakeHttpClient();
  betGateway.mockMakeBet(false);

  const makeBet = new MakeBet(bet);
  const sut = new MakeBetHandler({ betGateway, broker: brokerSpy, httpClient });
  await sut.handle(makeBet);

  expect(brokerSpy.events[0].name).toBe("bet-not-made");
  expect(brokerSpy.events[0].payload).toEqual(
    expect.objectContaining({
      matchId: expect.any(String),
      playerId: expect.any(String),
      betValue: expect.any(Number),
      reason: "Betfair could not proccess the request",
    })
  );
});

test("It should emit a bet node made event if user has no credits", async () => {
  const brokerSpy = new BrokerSpy(new InMemoryBroker());
  const betGateway = new FakeBetGateway();
  const httpClient = new FakeHttpClient();
  httpClient.mockGet({ statusCode: 200, data: { balance: 50 } });

  const makeBet = new MakeBet(bet);
  const sut = new MakeBetHandler({ betGateway, broker: brokerSpy, httpClient });
  await sut.handle(makeBet);

  expect(brokerSpy.events[0].name).toBe("bet-not-made");
  expect(brokerSpy.events[0].payload).toEqual(
    expect.objectContaining({
      matchId: expect.any(String),
      playerId: expect.any(String),
      betValue: expect.any(Number),
      reason: "insufficient funds",
    })
  );
});
