import type { Cursor } from "../../../cursor.js";
import { Client } from "../client.js";
import {
  PageableRequest,
  PageableRequestBuilder,
  type PageableParams,
} from "../pageable.js";
import type { Program, Season, Skill, SkillType } from "./index.js";

export class Skills extends Client {
  public findAll(
    request?: (builder: SkillsRequestBuilder) => SkillsRequestBuilder,
  ): Cursor<Skill> {
    return this.getAll(
      `/get_skills`,
      request?.(new SkillsRequestBuilder()).build().params(),
    );
  }
}

export class SkillsRequestBuilder extends PageableRequestBuilder<SkillsRequestBuilder> {
  #eventSku?: string;
  #program?: Program;
  #type?: SkillType;
  #team?: string;
  #season?: Season;
  #rank?: number;

  public eventSku(value: string) {
    this.#eventSku = value;
    return this;
  }

  public program(value: Program) {
    this.#program = value;
    return this;
  }

  public type(value: SkillType) {
    this.#type = value;
    return this;
  }

  public team(value: string) {
    this.#team = value;
    return this;
  }

  public season(value: Season) {
    this.#season = value;
    return this;
  }

  public rank(value: number) {
    this.#rank = value;
    return this;
  }

  public build() {
    return new SkillsRequest(this);
  }

  public static readonly SkillsRequest = class extends PageableRequest {
    public readonly eventSku?: string;
    public readonly program?: Program;
    public readonly type?: SkillType;
    public readonly team?: string;
    public readonly season?: Season;
    public readonly rank?: number;

    public constructor(builder: SkillsRequestBuilder) {
      super(builder);
      this.eventSku = builder.#eventSku;
      this.program = builder.#program;
      this.type = builder.#type;
      this.team = builder.#team;
      this.season = builder.#season;
      this.rank = builder.#rank;
    }

    public params(): SkillsParams {
      return {
        ...super.params(),
        sku: this.eventSku,
        program: this.program,
        type: this.type,
        team: this.team,
        season: this.season,
        rank: this.rank,
      };
    }
  };
}

export class SkillsRequest extends SkillsRequestBuilder.SkillsRequest {}

interface SkillsParams extends PageableParams {
  sku?: string;
  program?: Program;
  type?: SkillType;
  team?: string;
  season?: Season;
  rank?: number;
}
