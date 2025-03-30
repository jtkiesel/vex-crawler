export abstract class PageableRequestBuilder<
  T extends PageableRequestBuilder<any>,
> {
  #start?: number;
  #limit?: number;

  public start(value: number) {
    this.#start = value;
    return this as unknown as T;
  }

  /**
   * @param value max: 5000
   * @returns
   */
  public limit(value: number) {
    this.#limit = value;
    return this as unknown as T;
  }

  public abstract build(): PageableRequest;

  public static readonly PageableRequest = class {
    public readonly start?: number;
    public readonly limit?: number;

    public constructor(builder: PageableRequestBuilder<any>) {
      this.start = builder.#start;
      this.limit = builder.#limit;
    }

    public params(): PageableParams {
      return { limit_start: this.start, limit_number: this.limit };
    }
  };
}

export class PageableRequest extends PageableRequestBuilder.PageableRequest {}

export interface PageableParams {
  limit_start?: number;
  limit_number?: number;
}
