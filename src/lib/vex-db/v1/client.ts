import type { AxiosInstance } from "axios";
import { Cursor } from "../../cursor.js";

export abstract class Client {
  private readonly axiosInstance;

  public constructor(axiosInstance: AxiosInstance) {
    this.axiosInstance = axiosInstance;
  }

  protected async get<T>(path: string, params?: object): Promise<T> {
    const response = await this.axiosInstance.get<T>(path, { params });
    return response.data;
  }

  protected getAll<T>(path: string, params?: object): Cursor<T> {
    return new VexDbCursor((limit_start) =>
      this.get(path, limit_start ? { ...params, limit_start } : params),
    );
  }
}

export class VexDbCursor<T> extends Cursor<T> {
  private readonly data: T[] = [];
  private readonly findPage: (limit_start: number) => Promise<T[]>;
  private currentStart = 0;
  private isLastPage = false;

  constructor(findPage: (limit_start: number) => Promise<T[]>) {
    super();
    this.findPage = findPage;
  }

  public async hasNext(): Promise<boolean> {
    if (this.currentStart === 0 || !this.data.length) {
      this.data.push(...(await this.nextPage()));
    }
    return this.data.length > 0 || !this.isLastPage;
  }

  public async next(): Promise<T> {
    if (!this.data.length && !this.isLastPage) {
      this.data.push(...(await this.nextPage()));
    }
    const next = this.data.shift();
    if (!next) {
      throw new Error("No elements remaining in cursor");
    }
    return next;
  }

  public async nextPage(): Promise<T[]> {
    if (this.data.length) {
      return this.data.splice(0);
    }
    if (this.isLastPage) {
      throw new Error("No elements remaining in cursor");
    }
    const data = await this.findPage(this.currentStart);

    this.currentStart += data.length;
    this.isLastPage = data.length === 0;

    return data;
  }
}
