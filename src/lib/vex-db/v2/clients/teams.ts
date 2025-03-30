import type { Cursor } from "../../../cursor.js";
import { Client } from "../client.js";
import {
  PageableRequest,
  PageableRequestBuilder,
  type PageableParams,
} from "../pageable.js";
import type { Grade, Team } from "./index.js";

export class Teams extends Client {
  public findAll(teamsRequest?: TeamsRequest): Cursor<Team> {
    return this.getAll("/teams", teamsRequest?.params());
  }

  public findAllByEvent(
    eventId: number,
    teamsRequest?: TeamsRequest,
  ): Cursor<Team> {
    return this.getAll(`/events/${eventId}/teams`, teamsRequest?.params());
  }

  public async findById(id: number): Promise<Team> {
    return this.get(`/teams/${id}`);
  }
}

export class TeamsRequestBuilder extends PageableRequestBuilder<TeamsRequestBuilder> {
  #ids?: number[];
  #numbers?: string[];
  #eventIds?: number[];
  #programIds?: number[];
  #grades?: Grade[];
  #countries?: string[];

  public ids(...value: number[]) {
    this.#ids = value;
    return this;
  }

  public numbers(...value: string[]) {
    this.#numbers = value;
    return this;
  }

  public eventIds(...value: number[]) {
    this.#eventIds = value;
    return this;
  }

  public programIds(...value: number[]) {
    this.#programIds = value;
    return this;
  }

  public grades(...value: Grade[]) {
    this.#grades = value;
    return this;
  }

  public countries(...value: string[]) {
    this.#countries = value;
    return this;
  }

  public build() {
    return new TeamsRequest(this);
  }

  public static readonly TeamsRequest = class extends PageableRequest {
    public readonly ids?: number[];
    public readonly numbers?: string[];
    public readonly eventIds?: number[];
    public readonly programIds?: number[];
    public readonly grades?: Grade[];
    public readonly countries?: string[];

    public constructor(builder: TeamsRequestBuilder) {
      super(builder);
      this.ids = builder.#ids;
      this.numbers = builder.#numbers;
      this.eventIds = builder.#eventIds;
      this.programIds = builder.#programIds;
      this.grades = builder.#grades;
      this.countries = builder.#countries;
    }

    public params(): TeamsParams {
      return {
        ...super.params(),
        id: this.ids,
        number: this.numbers,
        event: this.eventIds,
        program: this.programIds,
        grade: this.grades,
        country: this.countries,
      };
    }
  };
}

export class TeamsRequest extends TeamsRequestBuilder.TeamsRequest {}

interface TeamsParams extends PageableParams {
  id?: number[];
  number?: string[];
  event?: number[];
  program?: number[];
  grade?: Grade[];
  country?: string[];
}
