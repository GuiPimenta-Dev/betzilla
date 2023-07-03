export class FotmobBuilder {
  ht = [];
  ft = [];

  static aMatch() {
    return new FotmobBuilder();
  }

  withHomeGoalsHT(home: number = 1) {
    for (let i = 0; i < home; i++) {
      this.ht.push({ type: "Goal", isHome: true });
    }
    return this;
  }

  withAwayGoalsHT(away: number = 1) {
    for (let i = 0; i < away; i++) {
      this.ht.push({ type: "Goal", isHome: false });
    }
    return this;
  }

  withHomeGoalsFT(home: number = 1) {
    for (let i = 0; i < home; i++) {
      this.ht.push({ type: "Goal", isHome: true });
    }
    return this;
  }

  withAwayGoalsFT(away: number = 1) {
    for (let i = 0; i < away; i++) {
      this.ht.push({ type: "Goal", isHome: false });
    }
    return this;
  }

  build() {
    const events = [...this.ht, { type: "Half" }, ...this.ft];
    return { content: { matchFacts: { events: { events } } } };
  }
}
