import type { Cursor } from "../../../cursor.js";
import { Client } from "../client.js";
import {
  PageableRequest,
  PageableRequestBuilder,
  type PageableParams,
} from "../pageable.js";
import type { Grade, Program, RegistrationStatus, Team } from "./index.js";

export class Teams extends Client {
  public findAll(
    request?: (builder: TeamsRequestBuilder) => TeamsRequestBuilder,
  ): Cursor<Team> {
    return this.getAll(
      "/get_teams",
      request?.(new TeamsRequestBuilder()).build().params(),
    );
  }
}

export class TeamsRequestBuilder extends PageableRequestBuilder<TeamsRequestBuilder> {
  #number?: string;
  #program?: Program;
  #organization?: string;
  #city?: string;
  #region?: string;
  #country?: string;
  #grade?: Grade;
  #eventSku?: string;
  #registrationStatus?: RegistrationStatus;

  public number(value: string) {
    this.#number = value;
    return this;
  }

  public program(value: Program) {
    this.#program = value;
    return this;
  }

  public organization(value: string) {
    this.#organization = value;
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

  public grade(value: Grade) {
    this.#grade = value;
    return this;
  }

  public eventSku(value: string) {
    this.#eventSku = value;
    return this;
  }

  public registrationStatus(value: RegistrationStatus) {
    this.#registrationStatus = value;
    return this;
  }

  public build() {
    return new TeamsRequest(this);
  }

  public static readonly TeamsRequest = class extends PageableRequest {
    public readonly number?: string;
    public readonly program?: Program;
    public readonly organization?: string;
    public readonly city?: string;
    public readonly region?: string;
    public readonly country?: string;
    public readonly grade?: Grade;
    public readonly eventSku?: string;
    public readonly registrationStatus?: RegistrationStatus;

    public constructor(builder: TeamsRequestBuilder) {
      super(builder);
      this.number = builder.#number;
      this.program = builder.#program;
      this.organization = builder.#organization;
      this.city = builder.#city;
      this.region = builder.#region;
      this.country = builder.#country;
      this.grade = builder.#grade;
      this.eventSku = builder.#eventSku;
      this.registrationStatus = builder.#registrationStatus;
    }

    public params(): TeamsParams {
      return {
        ...super.params(),
        team: this.number,
        program: this.program,
        organisation: this.organization,
        city: this.city,
        region: this.region,
        country: this.country,
        grade: this.grade,
        sku: this.eventSku,
        is_registered: this.registrationStatus,
      };
    }
  };
}

export class TeamsRequest extends TeamsRequestBuilder.TeamsRequest {}

interface TeamsParams extends PageableParams {
  team?: string;
  program?: Program;
  organisation?: string;
  city?: string;
  region?: string;
  country?: string;
  grade?: Grade;
  sku?: string;
  is_registered?: RegistrationStatus;
}
