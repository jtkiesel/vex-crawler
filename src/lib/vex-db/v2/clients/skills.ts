import type { Cursor } from "../../../cursor.js";
import { Client } from "../client.js";
import {
  PageableRequest,
  PageableRequestBuilder,
  type PageableParams,
} from "../pageable.js";
import type { Skill, SkillType } from "./index.js";

export class Skills extends Client {
  public findAllByEvent(
    eventId: number,
    skillsRequest?: SkillsRequest,
  ): Cursor<Skill> {
    return this.getAll(`/events/${eventId}/skills`, skillsRequest?.params());
  }

  public findAllByTeam(
    teamId: number,
    skillsRequest?: SkillsRequest,
  ): Cursor<Skill> {
    return this.getAll(`/teams/${teamId}/skills`, skillsRequest?.params());
  }
}

export class SkillsRequestBuilder extends PageableRequestBuilder<SkillsRequestBuilder> {
  #eventIds?: number[];
  #teamIds?: number[];
  #types?: SkillType[];
  #seasonIds?: number[];

  public eventIds(...value: number[]) {
    this.#eventIds = value;
    return this;
  }

  public teamIds(...value: number[]) {
    this.#teamIds = value;
    return this;
  }

  public types(...value: SkillType[]) {
    this.#types = value;
    return this;
  }

  public seasonIds(...value: number[]) {
    this.#seasonIds = value;
    return this;
  }

  public build() {
    return new SkillsRequest(this);
  }

  public static readonly SkillsRequest = class extends PageableRequest {
    public readonly eventIds?: number[];
    public readonly teamIds?: number[];
    public readonly types?: SkillType[];
    public readonly seasonIds?: number[];

    public constructor(builder: SkillsRequestBuilder) {
      super(builder);
      this.eventIds = builder.#eventIds;
      this.teamIds = builder.#teamIds;
      this.types = builder.#types;
      this.seasonIds = builder.#seasonIds;
    }

    public override params(): SkillsParams {
      return {
        ...super.params(),
        event: this.eventIds,
        team: this.teamIds,
        type: this.types,
        season: this.seasonIds,
      };
    }
  };
}

export class SkillsRequest extends SkillsRequestBuilder.SkillsRequest {}

interface SkillsParams extends PageableParams {
  event?: number[];
  team?: number[];
  type?: SkillType[];
  season?: number[];
}
