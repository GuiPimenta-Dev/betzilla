import { ListMatchMarkets } from "../../../src/application/usecases/list-match-markets";
import { FakeBetGateway } from "../../utils/mocks/fake-bet-gateway";

test("It should list all initial match odds for a match", async () => {
  const betGateway = new FakeBetGateway();
  betGateway.mockListMatchMarkets([
    {
      id: "1.213876181",
      name: "Over/Under 0.5 Goals",
    },
    {
      id: "1.213876105",
      name: "Over/Under 6.5 Goals",
    },
  ]);
  betGateway.mockListMarketOdds([
    {
      id: 50788424,
      back: [1.01],
      lay: [0],
    },
    {
      id: 20530281,
      back: [1.03, 1.02, 1.01],
      lay: [1000, 0, 0],
    },
  ]);

  const sut = new ListMatchMarkets({ betGateway });
  const markets = await sut.execute("matchId");

  expect(markets).toEqual([
    {
      id: "1.213876181",
      name: "Over/Under 0.5 Goals",
      odds: [
        {
          id: 50788424,
          back: [1.01],
          lay: [0],
        },
        {
          id: 20530281,
          back: [1.03, 1.02, 1.01],
          lay: [1000, 0, 0],
        },
      ],
    },
    {
      id: "1.213876105",
      name: "Over/Under 6.5 Goals",
      odds: [
        {
          id: 50788424,
          back: [1.01],
          lay: [0],
        },
        {
          id: 20530281,
          back: [1.03, 1.02, 1.01],
          lay: [1000, 0, 0],
        },
      ],
    },
  ]);
});
