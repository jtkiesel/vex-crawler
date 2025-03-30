import type { Cursor } from "../../../cursor.js";
import { Client } from "../client.js";
import {
  PageableRequest,
  PageableRequestBuilder,
  type PageableParams,
} from "../pageable.js";
import type { Program } from "./index.js";

export class Programs extends Client {
  public findAll(programsRequest?: ProgramsRequest): Cursor<Program> {
    return this.getAll("/programs", programsRequest?.params());
  }
}

export class ProgramsRequestBuilder extends PageableRequestBuilder<ProgramsRequestBuilder> {
  #ids?: number[];
  #names?: string[];

  public ids(...value: number[]) {
    this.#ids = value;
    return this;
  }

  public names(...value: string[]) {
    this.#names = value;
    return this;
  }

  public build() {
    return new ProgramsRequest(this);
  }

  public static readonly ProgramsRequest = class extends PageableRequest {
    public readonly ids?: number[];
    public readonly names?: string[];

    public constructor(builder: ProgramsRequestBuilder) {
      super(builder);
      this.ids = builder.#ids;
      this.names = builder.#names;
    }

    public params(): ProgramsParams {
      return { ...super.params(), id: this.ids, names: this.names };
    }
  };
}

export class ProgramsRequest extends ProgramsRequestBuilder.ProgramsRequest {}

interface ProgramsParams extends PageableParams {
  id?: number[];
  names?: string[];
}
