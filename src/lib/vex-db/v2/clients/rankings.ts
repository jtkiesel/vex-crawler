import type { Cursor } from "../../../cursor.js";
import { Client } from "../client.js";
import {
  PageableRequest,
  PageableRequestBuilder,
  type PageableParams,
} from "../pageable.js";
import type { Ranking } from "./index.js";

export class Rankings extends Client {
  public findAllByEventDivision(
    eventId: number,
    divisionId: number,
    rankingsRequest?: RankingsRequest,
  ): Cursor<Ranking> {
    return this.getAll(
      `/events/${eventId}/divisions/${divisionId}/rankings`,
      rankingsRequest?.params(),
    );
  }

  public findAllByTeam(
    teamId: number,
    rankingsRequest?: RankingsRequest,
  ): Cursor<Ranking> {
    return this.getAll(`/teams/${teamId}/rankings`, rankingsRequest?.params());
  }
}

export class RankingsRequestBuilder extends PageableRequestBuilder<RankingsRequestBuilder> {
  #ids?: number[];
  #eventIds?: number[];
  #divisionIds?: number[];
  #teamIds?: number[];
  #ranks?: number[];

  public ids(...value: number[]) {
    this.#ids = value;
    return this;
  }

  public eventIds(...value: number[]) {
    this.#eventIds = value;
    return this;
  }

  public divisionIds(...value: number[]) {
    this.#divisionIds = value;
    return this;
  }

  public teamIds(...value: number[]) {
    this.#teamIds = value;
    return this;
  }

  public ranks(...value: number[]) {
    this.#ranks = value;
    return this;
  }

  public build() {
    return new RankingsRequest(this);
  }

  public static readonly RankingsRequest = class extends PageableRequest {
    public readonly ids?: number[];
    public readonly eventIds?: number[];
    public readonly divisionIds?: number[];
    public readonly teamIds?: number[];
    public readonly ranks?: number[];

    public constructor(builder: RankingsRequestBuilder) {
      super(builder);
      this.ids = builder.#ids;
      this.eventIds = builder.#eventIds;
      this.divisionIds = builder.#divisionIds;
      this.teamIds = builder.#teamIds;
      this.ranks = builder.#ranks;
    }

    public override params(): RankingsParams {
      return {
        ...super.params(),
        id: this.ids,
        event: this.eventIds,
        division: this.divisionIds,
        team: this.teamIds,
        rank: this.ranks,
      };
    }
  };
}

export class RankingsRequest extends RankingsRequestBuilder.RankingsRequest {}

interface RankingsParams extends PageableParams {
  id?: number[];
  event?: number[];
  division?: number[];
  team?: number[];
  rank?: number[];
}
