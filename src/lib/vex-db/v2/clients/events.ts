import type { Cursor } from "../../../cursor.js";
import { Client } from "../client.js";
import {
  PageableRequest,
  PageableRequestBuilder,
  type PageableParams,
} from "../pageable.js";
import type { Event } from "./index.js";

export class Events extends Client {
  public findAll(eventsRequest?: EventsRequest): Cursor<Event> {
    return this.getAll("/events", eventsRequest?.params());
  }

  public findAllBySeason(
    seasonId: number,
    eventsRequest?: EventsRequest,
  ): Cursor<Event> {
    return this.getAll(`/seasons/${seasonId}/events`, eventsRequest?.params());
  }

  public findAllByTeam(
    teamId: number,
    eventsRequest?: EventsRequest,
  ): Cursor<Event> {
    return this.getAll(`/teams/${teamId}/events`, eventsRequest?.params());
  }

  public async findById(id: number): Promise<Event> {
    return this.get(`/events/${id}`);
  }
}

export class EventsRequestBuilder extends PageableRequestBuilder<EventsRequestBuilder> {
  #ids?: number[];
  #skus?: string[];
  #teamIds?: number[];
  #seasonIds?: number[];
  #start?: Date;
  #end?: Date;

  public ids(...value: number[]) {
    this.#ids = value;
    return this;
  }

  public skus(...value: string[]) {
    this.#skus = value;
    return this;
  }

  public teamIds(...value: number[]) {
    this.#teamIds = value;
    return this;
  }

  public seasonIds(...value: number[]) {
    this.#seasonIds = value;
    return this;
  }

  public start(value: Date) {
    this.#start = value;
    return this;
  }

  public end(value: Date) {
    this.#end = value;
    return this;
  }

  public build() {
    return new EventsRequest(this);
  }

  public static readonly EventsRequest = class extends PageableRequest {
    public readonly ids?: number[];
    public readonly skus?: string[];
    public readonly teamIds?: number[];
    public readonly seasonIds?: number[];
    public readonly start?: Date;
    public readonly end?: Date;

    public constructor(builder: EventsRequestBuilder) {
      super(builder);
      this.ids = builder.#ids;
      this.skus = builder.#skus;
      this.teamIds = builder.#teamIds;
      this.seasonIds = builder.#seasonIds;
      this.start = builder.#start;
      this.end = builder.#end;
    }

    public params(): EventsParams {
      return {
        ...super.params(),
        id: this.ids,
        sku: this.skus,
        team: this.teamIds,
        season: this.seasonIds,
        start: this.start,
        end: this.end,
      };
    }
  };
}

export class EventsRequest extends EventsRequestBuilder.EventsRequest {}

interface EventsParams extends PageableParams {
  id?: number[];
  sku?: string[];
  team?: number[];
  season?: number[];
  start?: Date;
  end?: Date;
}
