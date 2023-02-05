import { BetGatewayMock } from "../../utils/mocks/bet-gateway-mock";
import { BrokerSpy } from "../../utils/mocks/broker-spy";
import { InMemoryAccountRepository } from "../../../src/infra/repositories/in-memory-account";
import { InMemoryBroker } from "../../../src/infra/brokers/in-memory";
import { MakeBet } from "../../../src/application/usecases/make-bet";

test("It should be able to make a bet and debit from player account", async () => {
  const broker = new InMemoryBroker();
  const betGateway = new BetGatewayMock();
  const accountRepository = new InMemoryAccountRepository();
  accountRepository.createDefaultAccount();

  const sut = new MakeBet({ betGateway, accountRepository, broker });
  const input = { accountId: "default", betValue: 100, betId: "some-bet-id" };
  await sut.execute(input);

  const balance = await (await accountRepository.findById("default")).getBalance();
  expect(betGateway.betValue).toBe(100);
  expect(balance).toBe(900);
});

test("It should emit an event when a bet is made", async () => {
  const brokerSpy = new BrokerSpy();
  const betGateway = new BetGatewayMock();
  const accountRepository = new InMemoryAccountRepository();
  accountRepository.createDefaultAccount();

  const sut = new MakeBet({ betGateway, accountRepository, broker: brokerSpy });
  const input = { accountId: "default", betValue: 100, betId: "some-bet-id" };
  await sut.execute(input);

  expect(brokerSpy.events.length).toBe(1);
  expect(brokerSpy.events[0].name).toBe("bet-made");
});
