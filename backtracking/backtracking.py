import pandas as pd


def backtrack_data(filename):
    data = pd.read_csv(filename, delimiter=';')
    data = data.replace(',', '.', regex=True)

    bets = []
    wins = []
    BET_VALUE = 10
    filtered_data = data[data['AVG_INITIAL_HOME_ODDS'].astype(float) >= 1.6]

    for _, row in filtered_data.iterrows():
        bets.append(BET_VALUE)
        if row["HALF_TIME_HOME_GOALS"] + row["HALF_TIME_AWAY_GOALS"] >=1:
            wins.append(BET_VALUE * float(row["AVG_INITIAL_HOME_ODDS"].replace(',', '.')))
    
    print('Total bets: ', len(bets))
    print('Total wins: ', len(wins))
    print('Total profit: ', sum(wins) - sum(bets))
    print('Total ROI: ', (sum(wins) - sum(bets)) / sum(bets) * 100, '%')


    return data
        

# Usage example
backtrack_data('premier_league.csv')
