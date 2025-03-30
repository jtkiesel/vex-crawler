import axios from "axios";
import QueryString from "qs";
import {
  Awards,
  Events,
  Matches,
  Programs,
  Rankings,
  Seasons,
  Skills,
  Teams,
} from "./clients/index.js";

export class VexDbClient {
  public readonly awards;
  public readonly events;
  public readonly matches;
  public readonly programs;
  public readonly rankings;
  public readonly seasons;
  public readonly skills;
  public readonly teams;

  constructor(options: VexDbClientOptions = {}) {
    const axiosInstance = axios.create({
      baseURL: options.url ?? "https://api.vexdb.io/v2",
      paramsSerializer: (params) =>
        QueryString.stringify(params, { arrayFormat: "comma" }),
    });
    this.awards = new Awards(axiosInstance);
    this.events = new Events(axiosInstance);
    this.matches = new Matches(axiosInstance);
    this.programs = new Programs(axiosInstance);
    this.rankings = new Rankings(axiosInstance);
    this.seasons = new Seasons(axiosInstance);
    this.skills = new Skills(axiosInstance);
    this.teams = new Teams(axiosInstance);
  }
}

export interface VexDbClientOptions {
  url?: string;
}
