import type { Cursor } from "../../../cursor.js";
import { Client } from "../client.js";
import {
  PageableRequest,
  PageableRequestBuilder,
  type PageableParams,
} from "../pageable.js";
import type { Award, Season } from "./index.js";

export class Awards extends Client {
  public findAll(
    request?: (builder: AwardsRequestBuilder) => AwardsRequestBuilder,
  ): Cursor<Award> {
    return this.getAll(
      "/get_awards",
      request?.(new AwardsRequestBuilder()).build().params(),
    );
  }
}

export class AwardsRequestBuilder extends PageableRequestBuilder<AwardsRequestBuilder> {
  #eventSku?: string;
  #name?: string;
  #winner?: string;
  #season?: Season;

  public eventSku(value: string) {
    this.#eventSku = value;
    return this;
  }

  public name(value: string) {
    this.#name = value;
    return this;
  }

  public winner(value: string) {
    this.#winner = value;
    return this;
  }

  public season(value: Season) {
    this.#season = value;
    return this;
  }

  public build() {
    return new AwardsRequest(this);
  }

  public static readonly AwardsRequest = class extends PageableRequest {
    public readonly eventSku?: string;
    public readonly name?: string;
    public readonly winner?: string;
    public readonly season?: Season;

    public constructor(builder: AwardsRequestBuilder) {
      super(builder);
      this.eventSku = builder.#eventSku;
      this.name = builder.#name;
      this.winner = builder.#winner;
      this.season = builder.#season;
    }

    public override params(): AwardsParams {
      return {
        ...super.params(),
        sku: this.eventSku,
        name: this.name,
        team: this.winner,
        season: this.season,
      };
    }
  };
}

export class AwardsRequest extends AwardsRequestBuilder.AwardsRequest {}

interface AwardsParams extends PageableParams {
  sku?: string;
  name?: string;
  team?: string;
  season?: Season;
}
