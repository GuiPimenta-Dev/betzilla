import { VerifyBetHandler } from "../../../src/application/handlers/verify-bet";
import { VerifyBet } from "../../../src/domain/commands/verify-bet";
import { InMemoryBroker } from "../../../src/infra/brokers/in-memory";
import { BrokerSpy } from "../../utils/mocks/broker-spy";
import { FakeBetGateway } from "../../utils/mocks/fake-bet-gateway";

const bet = { playerId: "playerId", matchId: "matchId", betId: "betId", marketId: 1 };

test("It should emit a bet won event and a bet verified event if bet was won", async () => {
  const brokerSpy = new BrokerSpy(new InMemoryBroker());
  const betGateway = new FakeBetGateway();
  betGateway.mockConsultBet({ status: "won", outcome: 100 });

  const verifyBet = new VerifyBet(bet);
  const sut = new VerifyBetHandler({ betGateway, broker: brokerSpy });
  await sut.handle(verifyBet);

  expect(brokerSpy.events.length).toBe(2);
  expect(brokerSpy.events[0].name).toBe("bet-won");
  expect(brokerSpy.events[0].payload).toEqual({
    playerId: "playerId",
    matchId: "matchId",
    betId: "betId",
    outcome: 100,
    marketId: 1,
  });
  expect(brokerSpy.events[1].name).toBe("bet-verified");
  expect(brokerSpy.events[1].payload).toEqual(bet);
});

test("It should emit a bet lost event and a bet verified event if bet was lost", async () => {
  const brokerSpy = new BrokerSpy(new InMemoryBroker());
  const betGateway = new FakeBetGateway();
  betGateway.mockConsultBet({ status: "lost", outcome: 0 });

  const verifyBet = new VerifyBet(bet);
  const sut = new VerifyBetHandler({ betGateway, broker: brokerSpy });
  await sut.handle(verifyBet);

  expect(brokerSpy.events.length).toBe(2);
  expect(brokerSpy.events[0].name).toBe("bet-lost");
  expect(brokerSpy.events[0].payload).toBe(bet);
  expect(brokerSpy.events[1].name).toBe("bet-verified");
  expect(brokerSpy.events[1].payload).toBe(bet);
});

test("It should schedule a new verify bet command if bet is still pending", async () => {
  const brokerSpy = new BrokerSpy(new InMemoryBroker());
  const betGateway = new FakeBetGateway();
  betGateway.mockConsultBet({ status: "pending", outcome: 0 });

  const verifyBet = new VerifyBet(bet);
  const sut = new VerifyBetHandler({ betGateway, broker: brokerSpy });
  await sut.handle(verifyBet);

  expect(brokerSpy.scheduledCommands.length).toBe(1);
  expect(brokerSpy.scheduledCommands[0].name).toBe("verify-bet");
  expect(brokerSpy.scheduledCommands[0].payload).toEqual(bet);
});

test("It should not emit a bet verified event if bet is pending", async () => {
  const brokerSpy = new BrokerSpy(new InMemoryBroker());
  const betGateway = new FakeBetGateway();
  betGateway.mockConsultBet({ status: "pending", outcome: 0 });

  const verifyBet = new VerifyBet(bet);
  const sut = new VerifyBetHandler({ betGateway, broker: brokerSpy });
  await sut.handle(verifyBet);

  expect(brokerSpy.events.length).toBe(0);
});

test("It should update de bet oucome when bet is won", async () => {
  const brokerSpy = new BrokerSpy(new InMemoryBroker());
  const betGateway = new FakeBetGateway();
  betGateway.mockConsultBet({ status: "won", outcome: 100 });

  const verifyBet = new VerifyBet(bet);
  const sut = new VerifyBetHandler({ betGateway, broker: brokerSpy });
  await sut.handle(verifyBet);

  expect(brokerSpy.events[0].payload.outcome).toBe(100);
});
