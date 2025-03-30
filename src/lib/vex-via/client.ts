import type { AxiosInstance } from "axios";
import { Cursor } from "../cursor.js";
import {
  AwardBuilder,
  AwardType,
  DivisionBuilder,
  EventBuilder,
  EventTeamBuilder,
  MatchBuilder,
  RankingBuilder,
  Round,
  Row,
  SkillAgeGroup,
  SkillBuilder,
  StatsBuilder,
  TeamAgeGroup,
  TeamBuilder,
} from "./clients/index.js";

export abstract class Client {
  private static readonly CSV_REGEX =
    /('[\s\S]*?'|(?:[^,\s]|'')+)(?=\s*,|\s*$)/g;
  private static readonly SQL_REGEX =
    /^[\s\S]*?\s+into\s+(?<table>\S+)\s+\((?<keys>[\s\S]+?)\)\s+values\s+\((?<values>[\s\S]+)\)[\s\S]*$/i;

  public constructor(private readonly axiosInstance: AxiosInstance) {}

  protected async get<T extends Row>(path: string, params?: object) {
    const response = await this.axiosInstance.get<string>(path, { params });
    return response.data
      .split(";\n")
      .filter((row) => row.length > 0)
      .map((row) => {
        const groups = Client.SQL_REGEX.exec(row)?.groups;
        const table = groups?.table;
        const keys = groups?.keys.match(Client.CSV_REGEX);
        const values = groups?.values.match(Client.CSV_REGEX);
        if (keys == null || values == null || keys.length !== values.length) {
          console.error("SQL did not match expected:", row);
          return undefined;
        }
        switch (table) {
          case "awards":
            return this.parseAward(keys, values);
          case "divisions":
            return this.parseDivision(keys, values);
          case "events":
            return this.parseEvent(keys, values);
          case "events_have_registered_teams":
            return this.parseEventRegisteredTeam(keys, values);
          case "events_have_teams":
            return this.parseEventTeam(keys, values);
          case "matches":
            return this.parseMatch(keys, values);
          case "rankings":
            return this.parseRanking(keys, values);
          case "skills":
            return this.parseSkill(keys, values);
          case "stats":
            return this.parseStats(keys, values);
          case "teams":
            return this.parseTeam(keys, values);
          case "deleted_sequence":
          case "match_detail_templates":
            return undefined;
          default:
            console.error("Unknown table name", table, "in row", row);
            return undefined;
        }
      })
      .filter((row) => row !== undefined) as unknown as T[];
  }

  protected getAll<T extends Row>(path: string, params?: object) {
    return new VexViaCursor((since) =>
      this.get<T>(path, since ? { ...params, since } : params),
    );
  }

  private parseAward(keys: string[], values: string[]) {
    return new AwardBuilder()
      .rowid(this.parseInt("rowid", keys, values))
      .modified(this.parseInt("modified", keys, values))
      .deleted(this.parseInt("deleted", keys, values))
      .sku(this.parseString("sku", keys, values))
      .division(this.parseInt("division", keys, values))
      .id(this.parseInt("id", keys, values))
      .name(this.parseString("name", keys, values))
      .type(this.parseString("type", keys, values) as AwardType)
      .teamnum(this.parseString("teamnum", keys, values))
      .recipient(this.parseString("recipient", keys, values))
      .build();
  }

  private parseDivision(keys: string[], values: string[]) {
    return new DivisionBuilder()
      .rowid(this.parseInt("rowid", keys, values))
      .modified(this.parseInt("modified", keys, values))
      .deleted(this.parseInt("deleted", keys, values))
      .sku(this.parseString("sku", keys, values))
      .id(this.parseInt("id", keys, values))
      .name(this.parseString("name", keys, values))
      .build();
  }

  private parseEvent(keys: string[], values: string[]) {
    return new EventBuilder()
      .rowid(this.parseInt("rowid", keys, values))
      .modified(this.parseInt("modified", keys, values))
      .deleted(this.parseInt("deleted", keys, values))
      .program(this.parseString("program", keys, values))
      .sku(this.parseString("sku", keys, values))
      .season(this.parseString("season", keys, values))
      .name(this.parseString("name", keys, values))
      .venue(this.parseString("venue", keys, values))
      .address1(this.parseString("address1", keys, values))
      .address2(this.parseString("address2", keys, values))
      .city(this.parseString("city", keys, values))
      .region(this.parseString("region", keys, values))
      .country(this.parseString("country", keys, values))
      .postcode(this.parseString("postcode", keys, values))
      .lat(this.parseFloat("lat", keys, values))
      .long(this.parseFloat("long", keys, values))
      .date_start(this.parseString("date_start", keys, values))
      .date_end(this.parseString("date_end", keys, values))
      .build();
  }

  private parseEventRegisteredTeam(keys: string[], values: string[]) {
    return new EventTeamBuilder()
      .rowid(this.parseInt("rowid", keys, values))
      .modified(this.parseInt("modified", keys, values))
      .deleted(this.parseInt("deleted", keys, values))
      .program(this.parseString("program", keys, values))
      .sku(this.parseString("sku", keys, values))
      .teamnum(this.parseString("teamnum", keys, values))
      .build();
  }

  private parseEventTeam(keys: string[], values: string[]) {
    return new EventTeamBuilder()
      .rowid(this.parseInt("rowid", keys, values))
      .modified(this.parseInt("modified", keys, values))
      .deleted(this.parseInt("deleted", keys, values))
      .program(this.parseString("program", keys, values))
      .sku(this.parseString("sku", keys, values))
      .division(this.parseInt("division", keys, values))
      .teamnum(this.parseString("teamnum", keys, values))
      .source(this.parseInt("source", keys, values))
      .build();
  }

  private parseMatch(keys: string[], values: string[]) {
    return new MatchBuilder()
      .rowid(this.parseInt("rowid", keys, values))
      .modified(this.parseInt("modified", keys, values))
      .deleted(this.parseInt("deleted", keys, values))
      .sku(this.parseString("sku", keys, values))
      .division(this.parseInt("division", keys, values))
      .round(this.parseString("round", keys, values) as Round)
      .instance(this.parseInt("instance", keys, values))
      .match(this.parseInt("match", keys, values))
      .data(JSON.parse(this.parseString("data", keys, values)))
      .build();
  }

  private parseRanking(keys: string[], values: string[]) {
    return new RankingBuilder()
      .rowid(this.parseInt("rowid", keys, values))
      .modified(this.parseInt("modified", keys, values))
      .deleted(this.parseInt("deleted", keys, values))
      .sku(this.parseString("sku", keys, values))
      .division(this.parseInt("division", keys, values))
      .round(this.parseString("round", keys, values) as Round)
      .teamnum(this.parseString("teamnum", keys, values))
      .rank(this.parseInt("rank", keys, values))
      .wp(this.parseInt("wp", keys, values))
      .ap(this.parseInt("ap", keys, values))
      .sp(this.parseInt("sp", keys, values))
      .wins(this.parseInt("wins", keys, values))
      .losses(this.parseInt("losses", keys, values))
      .ties(this.parseInt("ties", keys, values))
      .winPct(this.parseFloat("winPct", keys, values))
      .numMatches(this.parseInt("numMatches", keys, values))
      .totalPoints(this.parseInt("totalPoints", keys, values))
      .avgPoints(this.parseFloat("avgPoints", keys, values))
      .highScore(this.parseInt("highScore", keys, values))
      .build();
  }

  private parseSkill(keys: string[], values: string[]) {
    return new SkillBuilder()
      .rowid(this.parseInt("rowid", keys, values))
      .modified(this.parseInt("modified", keys, values))
      .deleted(this.parseInt("deleted", keys, values))
      .sku(this.parseString("sku", keys, values))
      .teamnum(this.parseString("teamnum", keys, values))
      .rank(this.parseInt("rank", keys, values))
      .tie(this.parseInt("tie", keys, values))
      .ageGroup(this.parseString("ageGroup", keys, values) as SkillAgeGroup)
      .totalScore(this.parseInt("totalScore", keys, values))
      .driverAttempts(this.parseInt("driverAttempts", keys, values))
      .driverHighScore(this.parseInt("driverHighScore", keys, values))
      .progAttempts(this.parseInt("progAttempts", keys, values))
      .progHighScore(this.parseInt("progHighScore", keys, values))
      .build();
  }

  private parseStats(keys: string[], values: string[]) {
    return new StatsBuilder()
      .rowid(this.parseInt("rowid", keys, values))
      .modified(this.parseInt("modified", keys, values))
      .deleted(this.parseInt("deleted", keys, values))
      .sku(this.parseString("sku", keys, values))
      .division(this.parseInt("division", keys, values))
      .teamnum(this.parseString("teamnum", keys, values))
      .opr(this.parseFloat("opr", keys, values))
      .dpr(this.parseFloat("dpr", keys, values))
      .ccwm(this.parseFloat("ccwm", keys, values))
      .build();
  }

  private parseTeam(keys: string[], values: string[]) {
    return new TeamBuilder()
      .rowid(this.parseInt("rowid", keys, values))
      .modified(this.parseInt("modified", keys, values))
      .deleted(this.parseInt("deleted", keys, values))
      .program(this.parseString("program", keys, values))
      .number(this.parseString("number", keys, values))
      .name(this.parseString("name", keys, values))
      .city(this.parseString("city", keys, values))
      .state(this.parseString("state", keys, values))
      .country(this.parseString("country", keys, values))
      .shortName(this.parseString("shortName", keys, values))
      .school(this.parseString("school", keys, values))
      .sponsors(this.parseString("sponsors", keys, values))
      .ageGroup(this.parseString("ageGroup", keys, values) as TeamAgeGroup)
      .build();
  }

  private parseInt(key: string, keys: string[], values: string[]) {
    return parseInt(this.value(key, keys, values));
  }

  private parseFloat(key: string, keys: string[], values: string[]) {
    return parseFloat(this.value(key, keys, values));
  }

  private parseString(key: string, keys: string[], values: string[]) {
    const text = this.value(key, keys, values);
    return text.startsWith("'") && text.endsWith("'")
      ? text.slice(1, -1).replaceAll("''", "'")
      : text;
  }

  private value(key: string, keys: string[], values: string[]) {
    return values[keys.indexOf(key)];
  }
}

export class VexViaCursor<T extends Row> extends Cursor<T> {
  private readonly values: T[] = [];
  private modified = 0;
  private isLastPage = false;

  public constructor(
    private readonly findPage: (since: number) => Promise<T[]>,
  ) {
    super();
  }

  public async hasNext() {
    if (this.modified === 0 || !this.values.length) {
      this.values.push(...(await this.nextPage()));
    }
    return this.values.length > 0 || !this.isLastPage;
  }

  public async next() {
    if (!this.values.length && !this.isLastPage) {
      this.values.push(...(await this.nextPage()));
    }
    const next = this.values.shift();
    if (!next) {
      throw new Error("No elements remaining in cursor");
    }
    return next;
  }

  public async nextPage() {
    if (this.values.length) {
      return this.values.splice(0);
    }
    if (this.isLastPage) {
      throw new Error("No elements remaining in cursor");
    }
    const values = await this.findPage(this.modified);

    this.modified = Math.max(...values.map(({ modified }) => modified));
    this.isLastPage = values.length === 0;

    return values;
  }
}
