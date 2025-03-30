import type { Cursor } from "../../../cursor.js";
import { Client } from "../client.js";
import {
  PageableRequest,
  PageableRequestBuilder,
  type PageableParams,
} from "../pageable.js";
import type { Match, ScoredStatus, Season } from "./index.js";

export class Matches extends Client {
  public findAll(
    request?: (builder: MatchesRequestBuilder) => MatchesRequestBuilder,
  ): Cursor<Match> {
    return this.getAll(
      "/get_matches",
      request?.(new MatchesRequestBuilder()).build().params(),
    );
  }
}

export class MatchesRequestBuilder extends PageableRequestBuilder<MatchesRequestBuilder> {
  #eventSku?: string;
  #division?: string;
  #team?: string;
  #round?: number;
  #instance?: number;
  #number?: number;
  #scheduled?: Date;
  #field?: string;
  #scored?: ScoredStatus;
  #season?: Season;

  public eventSku(value: string) {
    this.#eventSku = value;
    return this;
  }

  public division(value: string) {
    this.#division = value;
    return this;
  }

  public team(value: string) {
    this.#team = value;
    return this;
  }

  public round(value: number) {
    this.#round = value;
    return this;
  }

  public instance(value: number) {
    this.#instance = value;
    return this;
  }

  public number(value: number) {
    this.#number = value;
    return this;
  }

  public scheduled(value: Date) {
    this.#scheduled = value;
    return this;
  }

  public field(value: string) {
    this.#field = value;
    return this;
  }

  public scored(value: ScoredStatus) {
    this.#scored = value;
    return this;
  }

  public season(value: Season) {
    this.#season = value;
    return this;
  }

  public build() {
    return new MatchesRequest(this);
  }

  public static readonly MatchesRequest = class extends PageableRequest {
    public readonly eventSku?: string;
    public readonly division?: string;
    public readonly team?: string;
    public readonly round?: number;
    public readonly instance?: number;
    public readonly number?: number;
    public readonly scheduled?: Date;
    public readonly field?: string;
    public readonly scored?: ScoredStatus;
    public readonly season?: Season;

    public constructor(builder: MatchesRequestBuilder) {
      super(builder);
      this.eventSku = builder.#eventSku;
      this.division = builder.#division;
      this.team = builder.#team;
      this.round = builder.#round;
      this.instance = builder.#instance;
      this.number = builder.#number;
      this.scheduled = builder.#scheduled;
      this.field = builder.#field;
      this.scored = builder.#scored;
      this.season = builder.#season;
    }

    public params(): MatchesParams {
      return {
        ...super.params(),
        sku: this.eventSku,
        division: this.division,
        team: this.team,
        round: this.round,
        instance: this.instance,
        matchnum: this.number,
        scheduled: this.scheduled,
        field: this.field,
        scored: this.scored,
        season: this.season,
      };
    }
  };
}

export class MatchesRequest extends MatchesRequestBuilder.MatchesRequest {}

interface MatchesParams extends PageableParams {
  sku?: string;
  division?: string;
  team?: string;
  round?: number;
  instance?: number;
  matchnum?: number;
  scheduled?: Date;
  field?: string;
  scored?: ScoredStatus;
  season?: Season;
}
