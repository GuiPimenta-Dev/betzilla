import { VerifyBetHandler } from "../../../src/application/handlers/verify-bet";
import { VerifyBet } from "../../../src/domain/commands/verify-bet";
import { InMemoryBroker } from "../../../src/infra/brokers/in-memory";
import { BetBuilder } from "../../utils/builders/bet";
import { BetGatewayMock } from "../../utils/mocks/bet-gateway-mock";
import { BrokerSpy } from "../../utils/mocks/broker-spy";

test("It should emit a bet won event and a bet verified event if bet was won", async () => {
  const brokerSpy = new BrokerSpy(new InMemoryBroker());
  const betGateway = new BetGatewayMock();
  betGateway.mockConsultBetResponse({ status: "won", outcome: 100 });
  const handler = new VerifyBetHandler({ betGateway, broker: brokerSpy });

  const bet = BetBuilder.aBet().build();
  const verifyBet = new VerifyBet(bet);
  await handler.handle(verifyBet);

  expect(brokerSpy.events.length).toBe(2);
  expect(brokerSpy.events[0].name).toBe("bet-won");
  expect(brokerSpy.events[0].payload).toEqual({ ...bet, outcome: 100 });
  expect(brokerSpy.events[1].name).toBe("bet-verified");
  expect(brokerSpy.events[1].payload).toBe(bet);
});

test("It should emit a bet lost event and a bet verified event if bet was lost", async () => {
  const brokerSpy = new BrokerSpy(new InMemoryBroker());
  const betGateway = new BetGatewayMock();
  betGateway.mockConsultBetResponse({ status: "lost", outcome: 0 });
  const handler = new VerifyBetHandler({ betGateway, broker: brokerSpy });

  const bet = BetBuilder.aBet().build();
  const verifyBet = new VerifyBet(bet);
  await handler.handle(verifyBet);

  expect(brokerSpy.events.length).toBe(2);
  expect(brokerSpy.events[0].name).toBe("bet-lost");
  expect(brokerSpy.events[0].payload).toBe(bet);
  expect(brokerSpy.events[1].name).toBe("bet-verified");
  expect(brokerSpy.events[1].payload).toBe(bet);
});

test("It should schedule a new verify bet command if bet is still pending", async () => {
  const brokerSpy = new BrokerSpy(new InMemoryBroker());
  const betGateway = new BetGatewayMock();
  betGateway.mockConsultBetResponse({ status: "pending", outcome: 0 });
  const handler = new VerifyBetHandler({ betGateway, broker: brokerSpy });

  const bet = BetBuilder.aBet().build();
  const verifyBet = new VerifyBet(bet);
  await handler.handle(verifyBet);

  expect(brokerSpy.scheduledCommands.length).toBe(1);
  expect(brokerSpy.scheduledCommands[0].name).toBe("verify-bet");
  expect(brokerSpy.scheduledCommands[0].payload).toBe(bet);
});

test("It should not emit a bet verified event if bet is pending", async () => {
  const brokerSpy = new BrokerSpy(new InMemoryBroker());
  const betGateway = new BetGatewayMock();
  betGateway.mockConsultBetResponse({ status: "pending", outcome: 0 });
  const handler = new VerifyBetHandler({ betGateway, broker: brokerSpy });

  const bet = BetBuilder.aBet().build();
  const verifyBet = new VerifyBet(bet);
  await handler.handle(verifyBet);

  expect(brokerSpy.events.length).toBe(0);
});
