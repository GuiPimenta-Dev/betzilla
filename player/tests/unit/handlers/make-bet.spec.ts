import { MakeBetHandler } from "../../../src/application/handlers/make-bet";
import { MakeBet } from "../../../src/domain/commands/make-bet";
import { InMemoryBroker } from "../../../src/infra/brokers/in-memory";
import { BetBuilder } from "../../utils/builders/bet";
import { BetGatewayMock } from "../../utils/mocks/bet-gateway-mock";
import { BrokerSpy } from "../../utils/mocks/broker-spy";

test("It should wmit a bet made event after make the bet", async () => {
  const betGateway = new BetGatewayMock();
  const brokerSpy = new BrokerSpy(new InMemoryBroker());
  const handler = new MakeBetHandler({ betGateway, broker: brokerSpy });

  const bet = BetBuilder.aBet().build();
  const makeBet = new MakeBet(bet);
  await handler.handle(makeBet);

  expect(brokerSpy.events[0].name).toBe("bet-made");
  expect(brokerSpy.events[0].payload).toBe(bet);
});

test("It should throw an error if the bet was not made by the bet gateway", async () => {
  const brokerSpy = new BrokerSpy(new InMemoryBroker());
  const betGateway = new BetGatewayMock();
  betGateway.mockMakeBetResponse(false);
  const handler = new MakeBetHandler({ betGateway, broker: brokerSpy });

  const bet = BetBuilder.aBet().build();
  const makeBet = new MakeBet(bet);
  await expect(handler.handle(makeBet)).rejects.toThrow("Bet was not made");
});