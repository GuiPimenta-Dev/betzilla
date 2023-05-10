import { BrokerSpy } from "../../utils/mocks/broker-spy";
import { FakeBetGateway } from "../../utils/mocks/fake-bet-gateway";
import { InMemoryBroker } from "../../../src/infra/brokers/in-memory";
import { VerifyOdds } from "../../../src/domain/commands/verify-odds";
import { VerifyOddsHandler } from "../../../src/application/handlers/verify-odds";

test("It should emit a odds verified event after verifying a game odds", async () => {
  const brokerSpy = new BrokerSpy(new InMemoryBroker());
  const betGateway = new FakeBetGateway();
  betGateway.mockListMatchMarkets([{ id: "1", name: "Over/Under 0.5 Goals" }]);
  betGateway.mockListMarketOdds([{ id: "1", back: [2], lay: [3] }]);

  const handler = new VerifyOddsHandler({ betGateway, broker: brokerSpy });
  const verifyOdds = new VerifyOdds({ matchId: "matchId", market: "Over/Under 0.5 Goals" });
  await handler.handle(verifyOdds);

  expect(brokerSpy.events[0].name).toBe("odds-verified");
  expect(brokerSpy.events[0].payload).toEqual({
    matchId: "matchId",
    odds: [
      {
        id: "1",
        back: [2],
        lay: [3],
      },
    ],
  });
});

test("It should not emit a odds verified event if the market is not found", async () => {
  const brokerSpy = new BrokerSpy(new InMemoryBroker());
  const betGateway = new FakeBetGateway();
  betGateway.mockListMatchMarkets([{ id: "1", name: "Over/Under 0.5 Goals" }]);
  betGateway.mockListMarketOdds({ id: "1", back: [2], lay: [3] });

  const handler = new VerifyOddsHandler({ betGateway, broker: brokerSpy });
  const verifyOdds = new VerifyOdds({ matchId: "matchId", market: "Some Weird Market" });
  await handler.handle(verifyOdds);

  expect(brokerSpy.events.length).toBe(0);
});
