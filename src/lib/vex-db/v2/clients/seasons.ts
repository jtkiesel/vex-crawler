import type { Cursor } from "../../../cursor.js";
import { Client } from "../client.js";
import {
  PageableRequest,
  PageableRequestBuilder,
  type PageableParams,
} from "../pageable.js";
import type { Season } from "./index.js";

export class Seasons extends Client {
  public findAll(seasonsRequest?: SeasonsRequest): Cursor<Season> {
    return this.getAll("/seasons", seasonsRequest?.params());
  }

  public async findById(id: number): Promise<Season> {
    return this.get(`/seasons/${id}`);
  }
}

export class SeasonsRequestBuilder extends PageableRequestBuilder<SeasonsRequestBuilder> {
  #ids?: number[];
  #programIds?: number[];
  #start?: Date;
  #end?: Date;

  public ids(...value: number[]) {
    this.#ids = value;
    return this;
  }

  public programIds(...value: number[]) {
    this.#programIds = value;
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
    return new SeasonsRequest(this);
  }

  public static readonly SeasonsRequest = class extends PageableRequest {
    public readonly ids?: number[];
    public readonly programIds?: number[];
    public readonly start?: Date;
    public readonly end?: Date;

    public constructor(builder: SeasonsRequestBuilder) {
      super(builder);
      this.ids = builder.#ids;
      this.programIds = builder.#programIds;
      this.start = builder.#start;
      this.end = builder.#end;
    }

    public override params(): SeasonsParams {
      return {
        ...super.params(),
        id: this.ids,
        program: this.programIds,
        start: this.start,
        end: this.end,
      };
    }
  };
}

export class SeasonsRequest extends SeasonsRequestBuilder.SeasonsRequest {}

interface SeasonsParams extends PageableParams {
  id?: number[];
  program?: number[];
  start?: Date;
  end?: Date;
}
