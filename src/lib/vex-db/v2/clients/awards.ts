import type { Cursor } from "../../../cursor.js";
import { Client } from "../client.js";
import {
  PageableRequest,
  PageableRequestBuilder,
  type PageableParams,
} from "../pageable.js";
import type { Award } from "./index.js";

export class Awards extends Client {
  public findAll(awardsRequest?: AwardsRequest): Cursor<Award> {
    return this.getAll("/awards", awardsRequest?.params());
  }

  public findAllByEvent(
    eventId: number,
    awardsRequest?: AwardsRequest,
  ): Cursor<Award> {
    return this.getAll(`/events/${eventId}/awards`, awardsRequest?.params());
  }

  public findAllByTeam(
    teamId: number,
    awardsRequest?: AwardsRequest,
  ): Cursor<Award> {
    return this.getAll(`/teams/${teamId}/awards`, awardsRequest?.params());
  }

  public async findById(id: number): Promise<Award> {
    return this.get(`/awards/${id}`);
  }
}

export class AwardsRequestBuilder extends PageableRequestBuilder<AwardsRequestBuilder> {
  #ids?: number[];
  #eventIds?: number[];
  #teamIds?: number[];
  #winners?: string[];
  #seasonIds?: number[];
  #programIds?: number[];

  public ids(...value: number[]) {
    this.#ids = value;
    return this;
  }

  public eventIds(...value: number[]) {
    this.#eventIds = value;
    return this;
  }

  public teamIds(...value: number[]) {
    this.#teamIds = value;
    return this;
  }

  public winners(...value: string[]) {
    this.#winners = value;
    return this;
  }

  public seasonIds(...value: number[]) {
    this.#seasonIds = value;
    return this;
  }

  public programIds(...value: number[]) {
    this.#programIds = value;
    return this;
  }

  public build() {
    return new AwardsRequest(this);
  }

  public static readonly AwardsRequest = class extends PageableRequest {
    public readonly ids?: number[];
    public readonly eventIds?: number[];
    public readonly teamIds?: number[];
    public readonly winners?: string[];
    public readonly seasonIds?: number[];
    public readonly programIds?: number[];

    public constructor(builder: AwardsRequestBuilder) {
      super(builder);
      this.ids = builder.#ids;
      this.eventIds = builder.#eventIds;
      this.teamIds = builder.#teamIds;
      this.winners = builder.#winners;
      this.seasonIds = builder.#seasonIds;
      this.programIds = builder.#programIds;
    }

    public override params(): AwardsParams {
      return {
        ...super.params(),
        id: this.ids,
        event: this.eventIds,
        team: this.teamIds,
        winner: this.winners,
        season: this.seasonIds,
        program: this.programIds,
      };
    }
  };
}

export class AwardsRequest extends AwardsRequestBuilder.AwardsRequest {}

interface AwardsParams extends PageableParams {
  id?: number[];
  event?: number[];
  team?: number[];
  winner?: string[];
  season?: number[];
  program?: number[];
}
