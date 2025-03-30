import type { Cursor } from "../../../cursor.js";
import { Client } from "../client.js";
import {
  PageableRequest,
  PageableRequestBuilder,
  type PageableParams,
} from "../pageable.js";
import type { Match } from "./index.js";

export class Matches extends Client {
  public findAll(matchesRequest?: MatchesRequest): Cursor<Match> {
    return this.getAll("/matches", matchesRequest?.params());
  }

  public findAllByEventDivision(
    eventId: number,
    divisionId: number,
    matchesRequest?: MatchesRequest,
  ): Cursor<Match> {
    return this.getAll(
      `/events/${eventId}/divisions/${divisionId}/matches`,
      matchesRequest?.params(),
    );
  }

  public findAllByTeam(
    teamId: number,
    matchesRequest?: MatchesRequest,
  ): Cursor<Match> {
    return this.getAll(`/teams/${teamId}/matches`, matchesRequest?.params());
  }

  public async findById(id: number): Promise<Match> {
    return this.get(`/matches/${id}`);
  }
}

export class MatchesRequestBuilder extends PageableRequestBuilder<MatchesRequestBuilder> {
  #eventIds?: number[];
  #divisionIds?: number[];
  #teamIds?: number[];
  #seasonIds?: number[];
  #rounds?: number[];
  #instances?: number[];
  #numbers?: number[];

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

  public seasonIds(...value: number[]) {
    this.#seasonIds = value;
    return this;
  }

  public rounds(...value: number[]) {
    this.#rounds = value;
    return this;
  }

  public instances(...value: number[]) {
    this.#instances = value;
    return this;
  }

  public numbers(...value: number[]) {
    this.#numbers = value;
    return this;
  }

  public build() {
    return new MatchesRequest(this);
  }

  public static readonly MatchesRequest = class extends PageableRequest {
    public readonly eventIds?: number[];
    public readonly divisionIds?: number[];
    public readonly teamIds?: number[];
    public readonly seasonIds?: number[];
    public readonly rounds?: number[];
    public readonly instances?: number[];
    public readonly numbers?: number[];

    public constructor(builder: MatchesRequestBuilder) {
      super(builder);
      this.eventIds = builder.#eventIds;
      this.divisionIds = builder.#divisionIds;
      this.teamIds = builder.#teamIds;
      this.seasonIds = builder.#seasonIds;
      this.rounds = builder.#rounds;
      this.instances = builder.#instances;
      this.numbers = builder.#numbers;
    }

    public params(): MatchesParams {
      return {
        ...super.params(),
        event: this.eventIds,
        division: this.divisionIds,
        team: this.teamIds,
        season: this.seasonIds,
        round: this.rounds,
        instance: this.instances,
        matchnum: this.numbers,
      };
    }
  };
}

export class MatchesRequest extends MatchesRequestBuilder.MatchesRequest {}

interface MatchesParams extends PageableParams {
  event?: number[];
  division?: number[];
  team?: number[];
  season?: number[];
  round?: number[];
  instance?: number[];
  matchnum?: number[];
}
