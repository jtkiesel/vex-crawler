import type { Cursor } from "../../../cursor.js";
import { Client } from "../client.js";
import type { SeasonSkill } from "./index.js";
import { SkillsRequestBuilder } from "./skills.js";

export class SeasonSkills extends Client {
  public findAll(
    request?: (builder: SkillsRequestBuilder) => SkillsRequestBuilder,
  ): Cursor<SeasonSkill> {
    return this.getAll(`/get_skills`, {
      ...request?.(new SkillsRequestBuilder()).build().params(),
      season_rank: true,
    });
  }
}
