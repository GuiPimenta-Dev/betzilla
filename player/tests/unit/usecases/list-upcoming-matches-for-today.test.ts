import moment from "moment";
import { ListUpcomingMatchesForToday } from "../../../src/application/usecases/list-upcoming-matches-for-today";
import { FakeBetGateway } from "../../utils/mocks/fake-bet-gateway";

test("It should list only upcoming matches for today", async () => {
  const betGateway = new FakeBetGateway();
  betGateway.mockListMatchesForToday([
    {
      id: "1",
      date: "2021-01-01T20:00:00.000Z",
      name: "Flamengo vs Vasco",
    },
    {
      id: "2",
      date: "2021-01-01T10:00:00.000Z",
      name: "Cruzeiro vs Palmeiras",
    },
  ]);

  const sut = new ListUpcomingMatchesForToday({ betGateway });
  const date = moment("2021-01-01T12:00:00.000Z");
  const matches = await sut.execute(date);

  expect(matches.length).toBe(1);
  expect(matches[0]).toEqual({ id: "1", date: "2021-01-01T20:00:00.000Z", name: "Flamengo vs Vasco" });
});
