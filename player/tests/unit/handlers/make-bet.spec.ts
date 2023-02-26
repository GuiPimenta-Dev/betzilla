import { MakeBetHandler } from "../../../src/application/handlers/make-bet";
import { MakeBet } from "../../../src/domain/commands/make-bet";
import { InMemoryBroker } from "../../../src/infra/brokers/in-memory";
import { BetBuilder } from "../../utils/builders/bet";
import { BrokerSpy } from "../../utils/mocks/broker-spy";
import { FakeBetGateway } from "../../utils/mocks/fake-bet-gateway";

test("It should wmit a bet made event after make the bet", async () => {
  const betGateway = new FakeBetGateway();
  const brokerSpy = new BrokerSpy(new InMemoryBroker());

  const bet = BetBuilder.aBet().build();
  const makeBet = new MakeBet(bet);
  const sut = new MakeBetHandler({ betGateway, broker: brokerSpy });
  await sut.handle(makeBet);

  expect(brokerSpy.events[0].name).toBe("bet-made");
  expect(brokerSpy.events[0].payload).toBe(bet);
});

test("It should throw an error if the bet was not made by the bet gateway", async () => {
  const brokerSpy = new BrokerSpy(new InMemoryBroker());
  const betGateway = new FakeBetGateway();
  betGateway.mockMakeBetResponse(false);

  const bet = BetBuilder.aBet().build();
  const makeBet = new MakeBet(bet);
  const sut = new MakeBetHandler({ betGateway, broker: brokerSpy });
  await expect(sut.handle(makeBet)).rejects.toThrow("Bet was not made");
});
