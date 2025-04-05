import type { Cursor } from "../../../cursor.js";
import { Client } from "../client.js";
import {
  PageableRequest,
  PageableRequestBuilder,
  type PageableParams,
} from "../pageable.js";
import type { Program, Ranking, Season } from "./index.js";

export class SeasonRankings extends Client {
  public findAll(
    request?: (
      builder: SeasonRankingsRequestBuilder,
    ) => SeasonRankingsRequestBuilder,
  ): Cursor<Ranking> {
    return this.getAll(
      `/get_season_rankings`,
      request?.(new SeasonRankingsRequestBuilder()).build().params(),
    );
  }
}

export class SeasonRankingsRequestBuilder extends PageableRequestBuilder<SeasonRankingsRequestBuilder> {
  #program?: Program;
  #season?: Season;
  #team?: string;
  #vRatingRank?: number;

  public program(value: Program) {
    this.#program = value;
    return this;
  }

  public season(value: Season) {
    this.#season = value;
    return this;
  }

  public team(value: string) {
    this.#team = value;
    return this;
  }

  public vRatingRank(value: number) {
    this.#vRatingRank = value;
    return this;
  }

  public build() {
    return new SeasonRankingsRequest(this);
  }

  public static readonly SeasonRankingsRequest = class extends PageableRequest {
    public readonly program?: Program;
    public readonly season?: Season;
    public readonly team?: string;
    public readonly vRatingRank?: number;

    public constructor(builder: SeasonRankingsRequestBuilder) {
      super(builder);
      this.program = builder.#program;
      this.season = builder.#season;
      this.team = builder.#team;
      this.vRatingRank = builder.#vRatingRank;
    }

    public override params(): SeasonRankingsParams {
      return {
        ...super.params(),
        program: this.program,
        season: this.season,
        team: this.team,
        vrating_rank: this.vRatingRank,
      };
    }
  };
}

export class SeasonRankingsRequest extends SeasonRankingsRequestBuilder.SeasonRankingsRequest {}

interface SeasonRankingsParams extends PageableParams {
  program?: Program;
  season?: Season;
  team?: string;
  vrating_rank?: number;
}
