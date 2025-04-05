import type { Cursor } from "../../../cursor.js";
import { Client } from "../client.js";
import {
  PageableRequest,
  PageableRequestBuilder,
  type PageableParams,
} from "../pageable.js";
import type { Ranking, Season } from "./index.js";

export class Rankings extends Client {
  public findAll(
    request?: (builder: RankingsRequestBuilder) => RankingsRequestBuilder,
  ): Cursor<Ranking> {
    return this.getAll(
      `/get_rankings`,
      request?.(new RankingsRequestBuilder()).build().params(),
    );
  }
}

export class RankingsRequestBuilder extends PageableRequestBuilder<RankingsRequestBuilder> {
  #eventSku?: string;
  #division?: string;
  #team?: string;
  #rank?: number;
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

  public rank(value: number) {
    this.#rank = value;
    return this;
  }

  public season(value: Season) {
    this.#season = value;
    return this;
  }

  public build() {
    return new RankingsRequest(this);
  }

  public static readonly RankingsRequest = class extends PageableRequest {
    public readonly eventSku?: string;
    public readonly division?: string;
    public readonly team?: string;
    public readonly rank?: number;
    public readonly season?: Season;

    public constructor(builder: RankingsRequestBuilder) {
      super(builder);
      this.eventSku = builder.#eventSku;
      this.division = builder.#division;
      this.team = builder.#team;
      this.rank = builder.#rank;
      this.season = builder.#season;
    }

    public override params(): RankingsParams {
      return {
        ...super.params(),
        sku: this.eventSku,
        division: this.division,
        team: this.team,
        rank: this.rank,
        season: this.season,
      };
    }
  };
}

export class RankingsRequest extends RankingsRequestBuilder.RankingsRequest {}

interface RankingsParams extends PageableParams {
  sku?: string;
  division?: string;
  team?: string;
  rank?: number;
  season?: Season;
}
