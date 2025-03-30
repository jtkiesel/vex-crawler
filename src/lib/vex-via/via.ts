export abstract class ViaRequestBuilder<
  T extends ViaRequest,
  B extends ViaRequestBuilder<any, any>,
> {
  #since?: number;
  #schema?: number;
  #timeout?: number;

  public since(value: number) {
    this.#since = value;
    return this as unknown as B;
  }

  public schema(value: number) {
    this.#schema = value;
    return this as unknown as B;
  }

  public timeout(value: number) {
    this.#timeout = value;
    return this as unknown as B;
  }

  public abstract build(): T;

  public static readonly ViaRequest = class {
    public readonly since?;
    public readonly schema?;
    public readonly timeout?;

    public constructor(builder: ViaRequestBuilder<any, any>) {
      this.since = builder.#since;
      this.schema = builder.#schema;
      this.timeout = builder.#timeout;
    }

    public params(): ViaParams {
      return {
        since: this.since,
        schema: this.schema,
        timeout: this.timeout,
      };
    }
  };
}

export class ViaRequest extends ViaRequestBuilder.ViaRequest {}

export interface ViaParams {
  since?: number;
  schema?: number;
  timeout?: number;
}
