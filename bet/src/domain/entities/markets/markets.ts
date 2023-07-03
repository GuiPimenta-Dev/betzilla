type matchResult = {
  goals: {
    ht: { home: number; away: number };
    ft: { home: number; away: number };
  };
};

export interface Market {
  name: string;
  consult(input: matchResult): boolean;
}

export class Under05HT implements Market {
  name = "Under 0.5 HT";
  consult(input: matchResult): boolean {
    const { goals } = input;
    return goals.ht.home + goals.ht.away < 0.5;
  }
}

export class Under15HT implements Market {
  name = "Under 1.5 HT";

  consult(input: matchResult): boolean {
    const { goals } = input;
    return goals.ht.home + goals.ht.away < 1.5;
  }
}

export class Under25HT implements Market {
  name = "Under 2.5 HT";
  consult(input: matchResult): boolean {
    const { goals } = input;
    return goals.ht.home + goals.ht.away < 2.5;
  }
}

export class Under35HT implements Market {
  name = "Under 3.5 HT";

  consult(input: matchResult): boolean {
    const { goals } = input;
    return goals.ht.home + goals.ht.away < 3.5;
  }
}

export class Under45HT implements Market {
  name = "Under 4.5 HT";

  consult(input: matchResult): boolean {
    const { goals } = input;
    return goals.ht.home + goals.ht.away < 4.5;
  }
}

export class Under55HT implements Market {
  name = "Under 5.5 HT";

  consult(input: matchResult): boolean {
    const { goals } = input;
    return goals.ht.home + goals.ht.away < 5.5;
  }
}

export class Under65HT implements Market {
  name = "Under 6.5 HT";
  consult(input: matchResult): boolean {
    const { goals } = input;
    return goals.ht.home + goals.ht.away < 6.5;
  }
}

export class Over05HT implements Market {
  name = "Over 0.5 HT";

  consult(input: matchResult): boolean {
    const { goals } = input;
    return goals.ht.home + goals.ht.away > 0.5;
  }
}

export class Over15HT implements Market {
  name = "Over 1.5 HT";

  consult(input: matchResult): boolean {
    const { goals } = input;
    return goals.ht.home + goals.ht.away > 1.5;
  }
}

export class Over25HT implements Market {
  name = "Over 2.5 HT";

  consult(input: matchResult): boolean {
    const { goals } = input;
    return goals.ht.home + goals.ht.away > 2.5;
  }
}

export class Over35HT implements Market {
  name = "Over 3.5 HT";

  consult(input: matchResult): boolean {
    const { goals } = input;
    return goals.ht.home + goals.ht.away > 3.5;
  }
}

export class Over45HT implements Market {
  name = "Over 4.5 HT";

  consult(input: matchResult): boolean {
    const { goals } = input;
    return goals.ht.home + goals.ht.away > 4.5;
  }
}

export class Over55HT implements Market {
  name = "Over 5.5 HT";

  consult(input: matchResult): boolean {
    const { goals } = input;
    return goals.ht.home + goals.ht.away > 5.5;
  }
}

export class Over65HT implements Market {
  name = "Over 6.5 HT";

  consult(input: matchResult): boolean {
    const { goals } = input;
    return goals.ht.home + goals.ht.away > 6.5;
  }
}

export class Under05FT implements Market {
  name = "Under 0.5 FT";

  consult(input: matchResult): boolean {
    const { goals } = input;
    return goals.ht.home + goals.ft.home + goals.ht.away + goals.ft.away < 0.5;
  }
}

export class Under15FT implements Market {
  name = "Under 1.5 FT";

  consult(input: matchResult): boolean {
    const { goals } = input;
    return goals.ht.home + goals.ft.home + goals.ht.away + goals.ft.away < 1.5;
  }
}

export class Under25FT implements Market {
  name = "Under 2.5 FT";

  consult(input: matchResult): boolean {
    const { goals } = input;
    return goals.ht.home + goals.ft.home + goals.ht.away + goals.ft.away < 2.5;
  }
}

export class Under35FT implements Market {
  name = "Under 3.5 FT";

  consult(input: matchResult): boolean {
    const { goals } = input;
    return goals.ht.home + goals.ft.home + goals.ht.away + goals.ft.away < 3.5;
  }
}

export class Under45FT implements Market {
  name = "Under 4.5 FT";

  consult(input: matchResult): boolean {
    const { goals } = input;
    return goals.ht.home + goals.ft.home + goals.ht.away + goals.ft.away < 4.5;
  }
}

export class Under55FT implements Market {
  name = "Under 5.5 FT";

  consult(input: matchResult): boolean {
    const { goals } = input;
    return goals.ht.home + goals.ft.home + goals.ht.away + goals.ft.away < 5.5;
  }
}

export class Under65FT implements Market {
  name = "Under 6.5 FT";

  consult(input: matchResult): boolean {
    const { goals } = input;
    return goals.ht.home + goals.ft.home + goals.ht.away + goals.ft.away < 6.5;
  }
}

export class Over05FT implements Market {
  name = "Over 0.5 FT";

  consult(input: matchResult): boolean {
    const { goals } = input;
    return goals.ht.home + goals.ft.home + goals.ht.away + goals.ft.away > 0.5;
  }
}

export class Over15FT implements Market {
  name = "Over 1.5 FT";

  consult(input: matchResult): boolean {
    const { goals } = input;
    return goals.ht.home + goals.ft.home + goals.ht.away + goals.ft.away > 1.5;
  }
}

export class Over25FT implements Market {
  name = "Over 2.5 FT";

  consult(input: matchResult): boolean {
    const { goals } = input;
    return goals.ht.home + goals.ft.home + goals.ht.away + goals.ft.away > 2.5;
  }
}

export class Over35FT implements Market {
  name = "Over 3.5 FT";

  consult(input: matchResult): boolean {
    const { goals } = input;
    return goals.ht.home + goals.ft.home + goals.ht.away + goals.ft.away > 3.5;
  }
}

export class Over45FT implements Market {
  name = "Over 4.5 FT";

  consult(input: matchResult): boolean {
    const { goals } = input;
    return goals.ht.home + goals.ft.home + goals.ht.away + goals.ft.away > 4.5;
  }
}

export class Over55FT implements Market {
  name = "Over 5.5 FT";

  consult(input: matchResult): boolean {
    const { goals } = input;
    return goals.ht.home + goals.ft.home + goals.ht.away + goals.ft.away > 5.5;
  }
}

export class Over65FT implements Market {
  name = "Over 6.5 FT";

  consult(input: matchResult): boolean {
    const { goals } = input;
    return goals.ht.home + goals.ft.home + goals.ht.away + goals.ft.away > 6.5;
  }
}

export class BTTSHT implements Market {
  name = "Both Teams To Score HT";

  consult(input: matchResult): boolean {
    const { goals } = input;
    return goals.ht.home > 0 && goals.ht.away > 0;
  }
}

export class BTTSFT implements Market {
  name = "Both Teams To Score FT";

  consult(input: matchResult): boolean {
    const { goals } = input;
    return goals.ht.home + goals.ft.home > 0 && goals.ht.away + goals.ft.away > 0;
  }
}
