import type { ObjectBuilder } from "../../builders.js";

export * from "./events.js";

abstract class RowBuilder<T extends Row, B extends RowBuilder<any, any>>
  implements ObjectBuilder<T>
{
  #rowid?: number;
  #modified?: number;
  #deleted?: number;

  public rowid(value: number) {
    this.#rowid = value;
    return this as unknown as B;
  }

  public modified(value: number) {
    this.#modified = value;
    return this as unknown as B;
  }

  public deleted(value: number) {
    this.#deleted = value;
    return this as unknown as B;
  }

  public abstract build(): T;

  public static readonly Row = class {
    public readonly rowid;
    public readonly modified;
    /**
     * Usually 0
     */
    public readonly deleted;

    public constructor(builder: RowBuilder<any, any>) {
      if (builder.#rowid === undefined) {
        throw new Error("Missing required property Row.rowid");
      }
      if (builder.#modified === undefined) {
        throw new Error("Missing required property Row.rowid");
      }
      if (builder.#deleted === undefined) {
        throw new Error("Missing required property Row.rowid");
      }
      this.rowid = builder.#rowid;
      this.modified = builder.#modified;
      this.deleted = builder.#deleted;
    }
  };
}

export class Row extends RowBuilder.Row {}

export class AwardBuilder extends RowBuilder<Award, AwardBuilder> {
  #sku?: string;
  #division?: number;
  #id?: number;
  #name?: string;
  #type?: AwardType;
  #teamnum?: string;
  #recipient?: string;

  public sku(value: string) {
    this.#sku = value;
    return this;
  }

  public division(value: number) {
    this.#division = value;
    return this;
  }

  public id(value: number) {
    this.#id = value;
    return this;
  }

  public name(value: string) {
    this.#name = value;
    return this;
  }

  public teamnum(value: string) {
    this.#teamnum = value;
    return this;
  }

  public recipient(value: string) {
    this.#recipient = value;
    return this;
  }

  public type(value: AwardType) {
    this.#type = value;
    return this;
  }

  public override build() {
    return new Award(this);
  }

  public static readonly Award = class extends Row {
    /**
     * Might be lowercase, and might have `tm` before postfix (`re-vrc-12-tm3456`)
     */
    public readonly sku;
    /**
     * References a {@link Division.id}
     */
    public readonly division;
    public readonly id;
    public readonly name;
    public readonly type;
    public readonly teamnum;
    public readonly recipient;

    public constructor(builder: AwardBuilder) {
      super(builder);
      if (builder.#sku === undefined) {
        throw new Error("Missing required property Award.sku");
      }
      if (builder.#division === undefined) {
        throw new Error("Missing required property Award.division");
      }
      if (builder.#id === undefined) {
        throw new Error("Missing required property Award.id");
      }
      if (builder.#name === undefined) {
        throw new Error("Missing required property Award.name");
      }
      if (builder.#type === undefined) {
        throw new Error("Missing required property Award.type");
      }
      if (builder.#teamnum === undefined) {
        throw new Error("Missing required property Award.teamnum");
      }
      if (builder.#recipient === undefined) {
        throw new Error("Missing required property Award.recipient");
      }
      this.sku = builder.#sku;
      this.division = builder.#division;
      this.id = builder.#id;
      this.name = builder.#name;
      this.type = builder.#type;
      this.teamnum = builder.#teamnum;
      this.recipient = builder.#recipient;
    }
  };
}

export class Award extends AwardBuilder.Award {}

export enum AwardType {
  Individual = "Individual",
  Team = "Team",
}

export class DivisionBuilder extends RowBuilder<Division, DivisionBuilder> {
  #sku?: string;
  #id?: number;
  #name?: string;

  public sku(value: string) {
    this.#sku = value;
    return this;
  }

  public id(value: number) {
    this.#id = value;
    return this;
  }

  public name(value: string) {
    this.#name = value;
    return this;
  }

  public override build() {
    return new Division(this);
  }

  public static readonly Division = class extends Row {
    /**
     * Might be lowercase, and might have `tm` before postfix (`re-vrc-12-tm3456`)
     */
    public readonly sku;
    public readonly id;
    public readonly name;

    public constructor(builder: DivisionBuilder) {
      super(builder);
      if (builder.#sku === undefined) {
        throw new Error("Missing required property Division.sku");
      }
      if (builder.#id === undefined) {
        throw new Error("Missing required property Division.id");
      }
      if (builder.#name === undefined) {
        throw new Error("Missing required property Division.name");
      }
      this.sku = builder.#sku;
      this.id = builder.#id;
      this.name = builder.#name;
    }
  };
}

export class Division extends DivisionBuilder.Division {}

export class EventBuilder extends RowBuilder<Event, EventBuilder> {
  #program?: string;
  #sku?: string;
  #season?: string;
  #name?: string;
  #venue?: string;
  #address1?: string;
  #address2?: string;
  #city?: string;
  #region?: string;
  #country?: string;
  #postcode?: string;
  #lat?: number;
  #long?: number;
  #date_start?: string;
  #date_end?: string;

  public program(value: string) {
    this.#program = value;
    return this;
  }

  public sku(value: string) {
    this.#sku = value;
    return this;
  }

  public season(value: string) {
    this.#season = value;
    return this;
  }

  public name(value: string) {
    this.#name = value;
    return this;
  }

  public venue(value: string) {
    this.#venue = value;
    return this;
  }

  public address1(value: string) {
    this.#address1 = value;
    return this;
  }

  public address2(value: string) {
    this.#address2 = value;
    return this;
  }

  public city(value: string) {
    this.#city = value;
    return this;
  }

  public region(value: string) {
    this.#region = value;
    return this;
  }

  public country(value: string) {
    this.#country = value;
    return this;
  }

  public postcode(value: string) {
    this.#postcode = value;
    return this;
  }

  public lat(value: number) {
    this.#lat = value;
    return this;
  }

  public long(value: number) {
    this.#long = value;
    return this;
  }

  public date_start(value: string) {
    this.#date_start = value;
    return this;
  }

  public date_end(value: string) {
    this.#date_end = value;
    return this;
  }

  public override build() {
    return new Event(this);
  }

  public static readonly Event = class extends Row {
    public readonly program;
    /**
     * Might be lowercase, and might have `tm` before postfix (`re-vrc-12-tm3456`)
     */
    public readonly sku;
    /**
     * Year range, in the format `YYYY-YYYY`
     */
    public readonly season;
    public readonly name;
    public readonly venue;
    public readonly address1;
    public readonly address2;
    public readonly city;
    public readonly region;
    public readonly country;
    public readonly postcode;
    /**
     * Might be 0
     */
    public readonly lat;
    /**
     * Might be 0
     */
    public readonly long;
    /**
     * Date string, in the format `YYYY-MM-DD`
     */
    public readonly date_start;
    /**
     * Date string, in the format `YYYY-MM-DD`
     */
    public readonly date_end;

    public constructor(builder: EventBuilder) {
      super(builder);
      if (builder.#program === undefined) {
        throw new Error("Missing required property Event.program");
      }
      if (builder.#sku === undefined) {
        throw new Error("Missing required property Event.sku");
      }
      if (builder.#season === undefined) {
        throw new Error("Missing required property Event.season");
      }
      if (builder.#name === undefined) {
        throw new Error("Missing required property Event.name");
      }
      if (builder.#venue === undefined) {
        throw new Error("Missing required property Event.venue");
      }
      if (builder.#address1 === undefined) {
        throw new Error("Missing required property Event.address1");
      }
      if (builder.#address2 === undefined) {
        throw new Error("Missing required property Event.address2");
      }
      if (builder.#city === undefined) {
        throw new Error("Missing required property Event.city");
      }
      if (builder.#region === undefined) {
        throw new Error("Missing required property Event.region");
      }
      if (builder.#country === undefined) {
        throw new Error("Missing required property Event.country");
      }
      if (builder.#postcode === undefined) {
        throw new Error("Missing required property Event.postcode");
      }
      if (builder.#lat === undefined) {
        throw new Error("Missing required property Event.lat");
      }
      if (builder.#long === undefined) {
        throw new Error("Missing required property Event.long");
      }
      if (builder.#date_start === undefined) {
        throw new Error("Missing required property Event.date_start");
      }
      if (builder.#date_end === undefined) {
        throw new Error("Missing required property Event.date_end");
      }
      this.program = builder.#program;
      this.sku = builder.#sku;
      this.season = builder.#season;
      this.name = builder.#name;
      this.venue = builder.#venue;
      this.address1 = builder.#address1;
      this.address2 = builder.#address2;
      this.city = builder.#city;
      this.region = builder.#region;
      this.country = builder.#country;
      this.postcode = builder.#postcode;
      this.lat = builder.#lat;
      this.long = builder.#long;
      this.date_start = builder.#date_start;
      this.date_end = builder.#date_end;
    }
  };
}

export class Event extends EventBuilder.Event {}

export class EventTeamBuilder extends RowBuilder<EventTeam, EventTeamBuilder> {
  #program?: string;
  #sku?: string;
  #division?: number;
  #teamnum?: string;
  #source?: number;

  public program(value: string) {
    this.#program = value;
    return this;
  }

  public sku(value: string) {
    this.#sku = value;
    return this;
  }

  public division(value: number) {
    this.#division = value;
    return this;
  }

  public teamnum(value: string) {
    this.#teamnum = value;
    return this;
  }

  public source(value: number) {
    this.#source = value;
    return this;
  }

  public override build() {
    return new EventTeam(this);
  }

  public static readonly EventTeam = class extends Row {
    public readonly program;
    /**
     * Might be lowercase, and might have `tm` before postfix (`re-vrc-12-tm3456`)
     */
    public readonly sku;
    /**
     * References a {@link Division.id}
     */
    public readonly division?;
    public readonly teamnum;
    /**
     * Usually 0
     */
    public readonly source?;

    public constructor(builder: EventTeamBuilder) {
      super(builder);
      if (builder.#program === undefined) {
        throw new Error("Missing required property EventTeam.program");
      }
      if (builder.#sku === undefined) {
        throw new Error("Missing required property EventTeam.sku");
      }
      if (builder.#teamnum === undefined) {
        throw new Error("Missing required property EventTeam.teamnum");
      }
      this.program = builder.#program;
      this.sku = builder.#sku;
      this.division = builder.#division;
      this.teamnum = builder.#teamnum;
      this.source = builder.#source;
    }
  };
}

export class EventTeam extends EventTeamBuilder.EventTeam {}

export class MatchBuilder extends RowBuilder<Match, MatchBuilder> {
  #sku?: string;
  #division?: number;
  #round?: Round;
  #instance?: number;
  #match?: number;
  #data?: MatchData;

  public sku(value: string) {
    this.#sku = value;
    return this;
  }

  public division(value: number) {
    this.#division = value;
    return this;
  }

  public round(value: Round) {
    this.#round = value;
    return this;
  }

  public instance(value: number) {
    this.#instance = value;
    return this;
  }

  public match(value: number) {
    this.#match = value;
    return this;
  }

  public data(value: MatchData) {
    this.#data = value;
    return this;
  }

  public override build() {
    return new Match(this);
  }

  public static readonly Match = class extends Row {
    /**
     * Might be lowercase, and might have `tm` before postfix (`re-vrc-12-tm3456`)
     */
    public readonly sku;
    /**
     * References a {@link Division.id}
     */
    public readonly division;
    public readonly round;
    public readonly instance;
    public readonly match;
    /**
     * Parsed from JSON string
     */
    public readonly data;

    public constructor(builder: MatchBuilder) {
      super(builder);
      if (builder.#sku === undefined) {
        throw new Error("Missing required property Match.sku");
      }
      if (builder.#division === undefined) {
        throw new Error("Missing required property Match.division");
      }
      if (builder.#round === undefined) {
        throw new Error("Missing required property Match.round");
      }
      if (builder.#instance === undefined) {
        throw new Error("Missing required property Match.instance");
      }
      if (builder.#match === undefined) {
        throw new Error("Missing required property Match.match");
      }
      if (builder.#data === undefined) {
        throw new Error("Missing required property Match.data");
      }
      this.sku = builder.#sku;
      this.division = builder.#division;
      this.round = builder.#round;
      this.instance = builder.#instance;
      this.match = builder.#match;
      this.data = builder.#data;
    }
  };
}

export class Match extends MatchBuilder.Match {}

export interface MatchData {
  info: {
    state: MatchState;
    /**
     * Might be 0
     */
    timeScheduled: number;
    /**
     * Might be 0
     */
    timeStarted: number;
    /**
     * Might be 0
     */
    timeResumed: number;
    matchTuple: MatchTuple;
    assignedField: {
      fieldSetId?: number;
      id?: number;
      /**
       * Might be ''
       */
      name: string;
    };
    /**
     * In "teamwork" games (like VIQC games), there are still 2 alliances
     */
    alliances: { teams: { number: string }[] }[];
  };
  finalScore: {
    /**
     * In "teamwork" games (like VIQC games), there are still 2 alliances
     */
    allianceScores: number[];
    /**
     * References an element of {@link scoreData.alliances}, but is 1-indexed (0 means tie)
     */
    winner: number;
    allianceDqs: boolean[];
  };
  scoreData?: {
    state: MatchState;
    /**
     * 0 until scored
     */
    timeSaved: number;
    matchTuple: MatchTuple;
    /**
     * The UUID of the VEX game, likely used to determine how to parse {@link scoreData.alliances.scoreTypes}/{@link scoreData.scoreTypes}
     */
    gameUuid: string;
    /**
     * In "teamwork" games (like VIQC games), there are still 2 alliances
     */
    alliances: {
      teams: ({ teamNum: string; sitting: boolean } | { number: string })[];
      /**
       * Present for games with multiple scores (like VRC games)
       */
      scoreTypes?: { name: string; val: number }[];
    }[];
    /**
     * Present for games with one score (like VIQC games)
     */
    scoreTypes?: { name: string; val: number }[];
  };
}

export enum MatchState {
  Unplayed = "UNPLAYED",
  Scored = "SCORED",
}

export interface MatchTuple {
  /**
   * References a {@link Division.id}
   */
  division: number;
  round: Round;
  instance: number;
  match: number;
  /**
   * Likely the event session number, though even leagues where only the last
   * session's match results exist seem to have this as 0, so not entirely sure.
   */
  session: number;
}

export class RankingBuilder extends RowBuilder<Ranking, RankingBuilder> {
  #sku?: string;
  #division?: number;
  #round?: Round;
  #teamnum?: string;
  #rank?: number;
  #wp?: number;
  #ap?: number;
  #sp?: number;
  #wins?: number;
  #losses?: number;
  #ties?: number;
  #winPct?: number;
  #numMatches?: number;
  #totalPoints?: number;
  #avgPoints?: number;
  #highScore?: number;

  public sku(value: string) {
    this.#sku = value;
    return this;
  }

  public division(value: number) {
    this.#division = value;
    return this;
  }

  public round(value: Round) {
    this.#round = value;
    return this;
  }

  public teamnum(value: string) {
    this.#teamnum = value;
    return this;
  }

  public rank(value: number) {
    this.#rank = value;
    return this;
  }

  public wp(value: number) {
    this.#wp = value;
    return this;
  }

  public ap(value: number) {
    this.#ap = value;
    return this;
  }

  public sp(value: number) {
    this.#sp = value;
    return this;
  }

  public wins(value: number) {
    this.#wins = value;
    return this;
  }

  public losses(value: number) {
    this.#losses = value;
    return this;
  }

  public ties(value: number) {
    this.#ties = value;
    return this;
  }

  public winPct(value: number) {
    this.#winPct = value;
    return this;
  }

  public numMatches(value: number) {
    this.#numMatches = value;
    return this;
  }

  public totalPoints(value: number) {
    this.#totalPoints = value;
    return this;
  }

  public avgPoints(value: number) {
    this.#avgPoints = value;
    return this;
  }

  public highScore(value: number) {
    this.#highScore = value;
    return this;
  }

  public override build() {
    return new Ranking(this);
  }

  public static readonly Ranking = class extends Row {
    /**
     * Might be lowercase, and might have `tm` before postfix (`re-vrc-12-tm3456`)
     */
    public readonly sku;
    /**
     * References a {@link Division.id}
     */
    public readonly division;
    /**
     * Usually {@link Round.Qualification}, but in IQ can also be {@link Round.TopN}
     */
    public readonly round;
    public readonly teamnum;
    public readonly rank;
    public readonly wp;
    public readonly ap;
    public readonly sp;
    public readonly wins;
    public readonly losses;
    public readonly ties;
    public readonly winPct;
    public readonly numMatches;
    public readonly totalPoints;
    public readonly avgPoints;
    public readonly highScore;

    public constructor(builder: RankingBuilder) {
      super(builder);
      if (builder.#sku === undefined) {
        throw new Error("Missing required property Ranking.sku");
      }
      if (builder.#division === undefined) {
        throw new Error("Missing required property Ranking.division");
      }
      if (builder.#round === undefined) {
        throw new Error("Missing required property Ranking.round");
      }
      if (builder.#teamnum === undefined) {
        throw new Error("Missing required property Ranking.teamnum");
      }
      if (builder.#rank === undefined) {
        throw new Error("Missing required property Ranking.rank");
      }
      if (builder.#wp === undefined) {
        throw new Error("Missing required property Ranking.wp");
      }
      if (builder.#ap === undefined) {
        throw new Error("Missing required property Ranking.ap");
      }
      if (builder.#sp === undefined) {
        throw new Error("Missing required property Ranking.sp");
      }
      if (builder.#wins === undefined) {
        throw new Error("Missing required property Ranking.wins");
      }
      if (builder.#losses === undefined) {
        throw new Error("Missing required property Ranking.losses");
      }
      if (builder.#ties === undefined) {
        throw new Error("Missing required property Ranking.ties");
      }
      if (builder.#winPct === undefined) {
        throw new Error("Missing required property Ranking.winPct");
      }
      if (builder.#numMatches === undefined) {
        throw new Error("Missing required property Ranking.numMatches");
      }
      if (builder.#totalPoints === undefined) {
        throw new Error("Missing required property Ranking.totalPoints");
      }
      if (builder.#avgPoints === undefined) {
        throw new Error("Missing required property Ranking.avgPoints");
      }
      if (builder.#highScore === undefined) {
        throw new Error("Missing required property Ranking.highScore");
      }
      this.sku = builder.#sku;
      this.division = builder.#division;
      this.round = builder.#round;
      this.teamnum = builder.#teamnum;
      this.rank = builder.#rank;
      this.wp = builder.#wp;
      this.ap = builder.#ap;
      this.sp = builder.#sp;
      this.wins = builder.#wins;
      this.losses = builder.#losses;
      this.ties = builder.#ties;
      this.winPct = builder.#winPct;
      this.numMatches = builder.#numMatches;
      this.totalPoints = builder.#totalPoints;
      this.avgPoints = builder.#avgPoints;
      this.highScore = builder.#highScore;
    }
  };
}

export class Ranking extends RankingBuilder.Ranking {}

export enum Round {
  Practice = "PRACTICE",
  Qualification = "QUAL",
  TopN = "TOP_N",
  RoundRobin = "ROUND_ROBIN",
  RoundOf128 = "R128",
  RoundOf64 = "R64",
  RoundOf32 = "R32",
  RoundOf16 = "R16",
  Quarterfinal = "QF",
  Semifinal = "SF",
  Final = "F",
}

export class SkillBuilder extends RowBuilder<Skill, SkillBuilder> {
  #sku?: string;
  #teamnum?: string;
  #rank?: number;
  #tie?: number;
  #ageGroup?: SkillAgeGroup;
  #totalScore?: number;
  #driverAttempts?: number;
  #driverHighScore?: number;
  #progAttempts?: number;
  #progHighScore?: number;

  public sku(value: string) {
    this.#sku = value;
    return this;
  }

  public teamnum(value: string) {
    this.#teamnum = value;
    return this;
  }

  public rank(value: number) {
    this.#rank = value;
    return this;
  }

  public tie(value: number) {
    this.#tie = value;
    return this;
  }

  public ageGroup(value: SkillAgeGroup) {
    this.#ageGroup = value;
    return this;
  }

  public totalScore(value: number) {
    this.#totalScore = value;
    return this;
  }

  public driverAttempts(value: number) {
    this.#driverAttempts = value;
    return this;
  }

  public driverHighScore(value: number) {
    this.#driverHighScore = value;
    return this;
  }

  public progAttempts(value: number) {
    this.#progAttempts = value;
    return this;
  }

  public progHighScore(value: number) {
    this.#progHighScore = value;
    return this;
  }

  public override build() {
    return new Skill(this);
  }

  public static readonly Skill = class extends Row {
    /**
     * Might be lowercase, and might have `tm` before postfix (`re-vrc-12-tm3456`)
     */
    public readonly sku;
    public readonly teamnum;
    public readonly rank;
    /**
     * Usually 0
     */
    public readonly tie;
    public readonly ageGroup;
    public readonly totalScore;
    public readonly driverAttempts;
    public readonly driverHighScore;
    public readonly progAttempts;
    public readonly progHighScore;

    public constructor(builder: SkillBuilder) {
      super(builder);
      if (builder.#sku === undefined) {
        throw new Error("Missing required property Skill.sku");
      }
      if (builder.#teamnum === undefined) {
        throw new Error("Missing required property Skill.teamnum");
      }
      if (builder.#rank === undefined) {
        throw new Error("Missing required property Skill.rank");
      }
      if (builder.#tie === undefined) {
        throw new Error("Missing required property Skill.tie");
      }
      if (builder.#ageGroup === undefined) {
        throw new Error("Missing required property Skill.ageGroup");
      }
      if (builder.#totalScore === undefined) {
        throw new Error("Missing required property Skill.totalScore");
      }
      if (builder.#driverAttempts === undefined) {
        throw new Error("Missing required property Skill.driverAttempts");
      }
      if (builder.#driverHighScore === undefined) {
        throw new Error("Missing required property Skill.driverHighScore");
      }
      if (builder.#progAttempts === undefined) {
        throw new Error("Missing required property Skill.progAttempts");
      }
      if (builder.#progHighScore === undefined) {
        throw new Error("Missing required property Skill.progHighScore");
      }
      this.sku = builder.#sku;
      this.teamnum = builder.#teamnum;
      this.rank = builder.#rank;
      this.tie = builder.#tie;
      this.ageGroup = builder.#ageGroup;
      this.totalScore = builder.#totalScore;
      this.driverAttempts = builder.#driverAttempts;
      this.driverHighScore = builder.#driverHighScore;
      this.progAttempts = builder.#progAttempts;
      this.progHighScore = builder.#progHighScore;
    }
  };
}

export class Skill extends SkillBuilder.Skill {}

export enum SkillAgeGroup {
  College = "College",
  HighSchool = "High School",
  MiddleSchool = "Middle School",
  Elementary = "Elementary",
}

export class StatsBuilder extends RowBuilder<Stats, StatsBuilder> {
  #sku?: string;
  #division?: number;
  #teamnum?: string;
  #opr?: number;
  #dpr?: number;
  #ccwm?: number;

  public sku(value: string) {
    this.#sku = value;
    return this;
  }

  public division(value: number) {
    this.#division = value;
    return this;
  }

  public teamnum(value: string) {
    this.#teamnum = value;
    return this;
  }

  public opr(value: number) {
    this.#opr = value;
    return this;
  }

  public dpr(value: number) {
    this.#dpr = value;
    return this;
  }

  public ccwm(value: number) {
    this.#ccwm = value;
    return this;
  }

  public override build() {
    return new Stats(this);
  }

  public static readonly Stats = class extends Row {
    /**
     * Might be lowercase, and might have `tm` before postfix (`re-vrc-12-tm3456`)
     */
    public readonly sku;
    /**
     * References a {@link Division.id}
     */
    public readonly division;
    public readonly teamnum;
    public readonly opr;
    public readonly dpr;
    public readonly ccwm;

    public constructor(builder: StatsBuilder) {
      super(builder);
      if (builder.#sku === undefined) {
        throw new Error("Missing required property Stat.sku");
      }
      if (builder.#division === undefined) {
        throw new Error("Missing required property Stat.division");
      }
      if (builder.#teamnum === undefined) {
        throw new Error("Missing required property Stat.teamnum");
      }
      if (builder.#opr === undefined) {
        throw new Error("Missing required property Stat.opr");
      }
      if (builder.#dpr === undefined) {
        throw new Error("Missing required property Stat.dpr");
      }
      if (builder.#ccwm === undefined) {
        throw new Error("Missing required property Stat.ccwm");
      }
      this.sku = builder.#sku;
      this.division = builder.#division;
      this.teamnum = builder.#teamnum;
      this.opr = builder.#opr;
      this.dpr = builder.#dpr;
      this.ccwm = builder.#ccwm;
    }
  };
}

export class Stats extends StatsBuilder.Stats {}

export class TeamBuilder extends RowBuilder<Team, TeamBuilder> {
  #program?: string;
  #number?: string;
  #name?: string;
  #city?: string;
  #state?: string;
  #country?: string;
  #shortName?: string;
  #school?: string;
  #sponsors?: string;
  #ageGroup?: TeamAgeGroup;

  public program(value: string) {
    this.#program = value;
    return this;
  }

  public number(value: string) {
    this.#number = value;
    return this;
  }

  public name(value: string) {
    this.#name = value;
    return this;
  }

  public city(value: string) {
    this.#city = value;
    return this;
  }

  public state(value: string) {
    this.#state = value;
    return this;
  }

  public country(value: string) {
    this.#country = value;
    return this;
  }

  public shortName(value: string) {
    this.#shortName = value;
    return this;
  }

  public school(value: string) {
    this.#school = value;
    return this;
  }

  public sponsors(value: string) {
    this.#sponsors = value;
    return this;
  }

  public ageGroup(value: TeamAgeGroup) {
    this.#ageGroup = value;
    return this;
  }

  public override build() {
    return new Team(this);
  }

  public static readonly Team = class extends Row {
    public readonly program;
    /**
     * Can be empty
     */
    public readonly number;
    public readonly name;
    public readonly city;
    public readonly state;
    public readonly country;
    /**
     * Usually the same as {@link name}
     */
    public readonly shortName;
    public readonly school;
    public readonly sponsors;
    public readonly ageGroup;

    public constructor(builder: TeamBuilder) {
      super(builder);
      if (builder.#program === undefined) {
        throw new Error("Missing required property Team.program");
      }
      if (builder.#number === undefined) {
        throw new Error("Missing required property Team.number");
      }
      if (builder.#name === undefined) {
        throw new Error("Missing required property Team.name");
      }
      if (builder.#city === undefined) {
        throw new Error("Missing required property Team.city");
      }
      if (builder.#state === undefined) {
        throw new Error("Missing required property Team.state");
      }
      if (builder.#country === undefined) {
        throw new Error("Missing required property Team.country");
      }
      if (builder.#shortName === undefined) {
        throw new Error("Missing required property Team.shortName");
      }
      if (builder.#school === undefined) {
        throw new Error("Missing required property Team.school");
      }
      if (builder.#sponsors === undefined) {
        throw new Error("Missing required property Team.sponsors");
      }
      if (builder.#ageGroup === undefined) {
        throw new Error("Missing required property Team.ageGroup");
      }
      this.program = builder.#program;
      this.number = builder.#number;
      this.name = builder.#name;
      this.city = builder.#city;
      this.state = builder.#state;
      this.country = builder.#country;
      this.shortName = builder.#shortName;
      this.school = builder.#school;
      this.sponsors = builder.#sponsors;
      this.ageGroup = builder.#ageGroup;
    }
  };
}

export class Team extends TeamBuilder.Team {}

export enum TeamAgeGroup {
  College = "COLLEGE",
  HighSchool = "HIGH_SCHOOL",
  MiddleSchool = "MIDDLE_SCHOOL",
  Elementary = "ELEMENTARY",
}
