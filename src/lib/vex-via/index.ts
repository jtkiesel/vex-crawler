import axios from "axios";
import { EventsClient } from "./clients/index.js";

export class VexViaClient {
  public readonly events;

  public constructor(options: VexViaClientOptions = {}) {
    const axiosInstance = axios.create({
      baseURL: options.url ?? "https://data.vexvia.dwabtech.com/api/v3",
    });
    this.events = new EventsClient(axiosInstance);
  }
}

export interface VexViaClientOptions {
  url?: string;
}
