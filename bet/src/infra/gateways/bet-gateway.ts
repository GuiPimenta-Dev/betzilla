import { Bet, BetGateway, BetStatus, Market, Match, Odd } from "../../../src/application/ports/gateways/bet";

import moment from "moment";
import { v4 as uuid } from "uuid";

export class FakeBetGateway implements BetGateway {
  bet: number;
  betMades: any[] = [];

  async makeBet(bet: Bet): Promise<{ success: boolean; betId: string }> {
    this.bet = bet.betValue;
    return { success: true, betId: uuid() };
  }

  async consultBet(): Promise<BetStatus> {
    this.betMades = [];
    if (Math.random() <= 0.5) return { status: "won", outcome: this.bet * 2 };
    return { status: "lost", outcome: 0 };
  }

  async listMatchesForToday(): Promise<Match[]> {
    const twoSecondsLater = moment().add(2, "seconds").toISOString();
    const CHAMPIONS_LEAGUE_TEAMS = [
      "Real Madrid",
      "Manchester City",
      "Bayern Munich",
      "Chelsea",
      "Liverpool",
      "Paris Saint-Germain",
      "Atletico Madrid",
      "Borussia Dortmund",
      "Juventus",
      "Barcelona",
      "Porto",
      "Sevilla",
      "Atalanta",
      "Lazio",
      "RB Leipzig",
      "Borussia Monchengladbach",
      "Ajax",
      "Manchester United",
      "Shakhtar Donetsk",
      "Zenit Saint Petersburg",
      "Club Brugge",
      "Dynamo Kyiv",
      "Olympiacos",
      "Ferencvaros",
      "Krasnodar",
      "Istanbul Basaksehir",
      "Rennes",
      "Midtjylland",
    ];

    const matches = [];

    while (CHAMPIONS_LEAGUE_TEAMS.length > 1) {
      const homeIndex = Math.floor(Math.random() * CHAMPIONS_LEAGUE_TEAMS.length);
      const homeTeam = CHAMPIONS_LEAGUE_TEAMS[homeIndex];
      CHAMPIONS_LEAGUE_TEAMS.splice(homeIndex, 1);

      const awayIndex = Math.floor(Math.random() * CHAMPIONS_LEAGUE_TEAMS.length);
      const awayTeam = CHAMPIONS_LEAGUE_TEAMS[awayIndex];
      CHAMPIONS_LEAGUE_TEAMS.splice(awayIndex, 1);

      const match = `${homeTeam} X ${awayTeam}`;
      matches.push(match);
    }

    if (CHAMPIONS_LEAGUE_TEAMS.length === 1) {
      matches.push(`${CHAMPIONS_LEAGUE_TEAMS[0]} has a bye`);
    }

    return matches.map((match) => ({ id: uuid(), leagueId: "1", name: match, date: twoSecondsLater }));
  }

  async listMatchMarkets(matchId: string): Promise<Market[]> {
    return [
      {
        id: "1.214014996",
        name: "Over/Under 6.5 Goals",
      },
      // {
      //   id: "1.214014997",
      //   name: "Half Time",
      // },
      // {
      //   id: "1.214014995",
      //   name: "First Half Goals 1.5",
      // },
      // {
      //   id: "1.214015000",
      //   name: "Goal Lines",
      // },
      // {
      //   id: "1.214015034",
      //   name: "Half Time Score",
      // },
      // {
      //   id: "1.214015035",
      //   name: "Over/Under 2.5 Goals",
      // },
      // {
      //   id: "1.214014998",
      //   name: "Over/Under 5.5 Goals",
      // },
      // {
      //   id: "1.214014999",
      //   name: "Correct Score",
      // },
      // {
      //   id: "1.214014987",
      //   name: "Over/Under 8.5 Goals",
      // },
      // {
      //   id: "1.214014988",
      //   name: "First Half Goals 2.5",
      // },
      // {
      //   id: "1.214014991",
      //   name: "Double Chance",
      // },
      // {
      //   id: "1.214014992",
      //   name: "SER Caxias do Sul U20 +1",
      // },
      // {
      //   id: "1.214014989",
      //   name: "Over/Under 7.5 Goals",
      // },
      // {
      //   id: "1.214014990",
      //   name: "Match Odds",
      // },
      // {
      //   id: "1.214015038",
      //   name: "Over/Under 1.5 Goals",
      // },
      // {
      //   id: "1.214015039",
      //   name: "Over/Under 3.5 Goals",
      // },
      // {
      //   id: "1.214015036",
      //   name: "Over/Under 4.5 Goals",
      // },
      // {
      //   id: "1.214015037",
      //   name: "Half Time/Full Time",
      // },
      // {
      //   id: "1.214015040",
      //   name: "Asian Handicap",
      // },
      // {
      //   id: "1.214015074",
      //   name: "Both teams to Score?",
      // },
      // {
      //   id: "1.214015075",
      //   name: "Draw no Bet",
      // },
      // {
      //   id: "1.214015076",
      //   name: "APAFUT U20 +1",
      // },
    ];
  }

  async listMarketOdds(marketId: string): Promise<Odd[]> {
    return [
      {
        id: "2542448",
        back: [0, 0, 0],
        lay: [1.02, 1.03, 1.04],
      },
      {
        id: "2542449",
        back: [34, 23, 21],
        lay: [300, 0, 0],
      },
    ];
  }
}
