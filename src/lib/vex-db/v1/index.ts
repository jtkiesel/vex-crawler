import axios from "axios";
import {
  Awards,
  Events,
  Matches,
  Rankings,
  SeasonRankings,
  SeasonSkills,
  Skills,
  Teams,
} from "./clients/index.js";

export class VexDbV1Client {
  public readonly awards;
  public readonly events;
  public readonly matches;
  public readonly rankings;
  public readonly seasonRankings;
  public readonly seasonSkills;
  public readonly skills;
  public readonly teams;

  constructor(options: VexDbV1ClientOptions = {}) {
    const axiosInstance = axios.create({
      baseURL: options.url ?? "https://api.vexdb.io/v1",
    });
    this.awards = new Awards(axiosInstance);
    this.events = new Events(axiosInstance);
    this.matches = new Matches(axiosInstance);
    this.rankings = new Rankings(axiosInstance);
    this.seasonRankings = new SeasonRankings(axiosInstance);
    this.seasonSkills = new SeasonSkills(axiosInstance);
    this.skills = new Skills(axiosInstance);
    this.teams = new Teams(axiosInstance);
  }
}

export interface VexDbV1ClientOptions {
  url?: string;
}
