import type { Cursor } from "../../../cursor.js";
import { Client } from "../client.js";
import {
  PageableRequest,
  PageableRequestBuilder,
  type PageableParams,
} from "../pageable.js";
import type { Event, EventStatus, Program, Season } from "./index.js";

export class Events extends Client {
  public findAll(
    request?: (builder: EventsRequestBuilder) => EventsRequestBuilder,
  ): Cursor<Event> {
    return this.getAll(
      "/get_events",
      request?.(new EventsRequestBuilder()).build().params(),
    );
  }
}

export class EventsRequestBuilder extends PageableRequestBuilder<EventsRequestBuilder> {
  #sku?: string;
  #program?: Program;
  #date?: Date;
  #season?: Season;
  #city?: string;
  #region?: string;
  #country?: string;
  #status?: EventStatus;
  #teamNumber?: string;

  public sku(value: string) {
    this.#sku = value;
    return this;
  }

  public program(value: Program) {
    this.#program = value;
    return this;
  }

  public date(value: Date) {
    this.#date = value;
    return this;
  }

  public season(value: Season) {
    this.#season = value;
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

  public status(value: EventStatus) {
    this.#status = value;
    return this;
  }

  public teamNumber(value: string) {
    this.#teamNumber = value;
    return this;
  }

  public build() {
    return new EventsRequest(this);
  }

  public static readonly EventsRequest = class extends PageableRequest {
    public readonly sku?: string;
    public readonly program?: Program;
    public readonly date?: Date;
    public readonly season?: Season;
    public readonly city?: string;
    public readonly region?: string;
    public readonly country?: string;
    public readonly status?: EventStatus;
    public readonly teamNumber?: string;

    public constructor(builder: EventsRequestBuilder) {
      super(builder);
      this.sku = builder.#sku;
      this.program = builder.#program;
      this.date = builder.#date;
      this.season = builder.#season;
      this.city = builder.#city;
      this.region = builder.#region;
      this.country = builder.#country;
      this.status = builder.#status;
      this.teamNumber = builder.#teamNumber;
    }

    public override params(): EventsParams {
      return {
        ...super.params(),
        sku: this.sku,
        program: this.program,
        date: this.date,
        season: this.season,
        city: this.city,
        region: this.region,
        country: this.country,
        status: this.status,
        team: this.teamNumber,
      };
    }
  };
}

export class EventsRequest extends EventsRequestBuilder.EventsRequest {}

interface EventsParams extends PageableParams {
  sku?: string;
  program?: Program;
  date?: Date;
  season?: Season;
  city?: string;
  region?: string;
  country?: string;
  status?: EventStatus;
  team?: string;
}
