export * from "./awards.js";
export * from "./events.js";
export * from "./matches.js";
export * from "./rankings.js";
export * from "./season-rankings.js";
export * from "./season-skills.js";
export * from "./skills.js";
export * from "./teams.js";

export interface Award {
  sku: string;
  name: string;
  team: string; // team number or individual
  qualifies: string[]; // SKUs
  order: number;
}

export interface Event {
  sku: string;
  key: string;
  program: Program;
  name: string;
  loc_venue: string;
  loc_address1: string;
  loc_address2: string;
  loc_city: string;
  loc_region: string;
  loc_postcode: string;
  loc_country: string;
  season: Season;
  start: string;
  end: string;
  divisions: string[];
}

export enum EventStatus {
  Past = "past",
  Future = "future",
}

export enum Grade {
  College = "College",
  HighSchool = "High School",
  MiddleSchool = "Middle School",
}

export interface Match {
  sku: string;
  division: string;
  round: number;
  instance: number;
  matchnum: number;
  field: string;
  red1: string;
  red2: string;
  red3: string;
  redsit: string;
  blue1: string;
  blue2: string;
  blue3: string;
  bluesit: string;
  redscore: number;
  bluescore: number;
  scored: ScoredStatus;
  scheduled: string; // Might be new Date(0)
}

export enum Program {
  Vrc = "VRC",
  VexU = "VEXU",
}

export interface Ranking {
  sku: string;
  division: string;
  rank: number;
  team: string;
  wins: number;
  losses: number;
  ties: number;
  wp: number;
  ap: number;
  sp: number;
  trsp: number;
  max_score: number;
  opr: number;
  dpr: number;
  ccwm: number;
}

export enum RegistrationStatus {
  Unregistered = 0,
  Registered = 1,
}

export enum ScoredStatus {
  Unscored = 0,
  Scored = 1,
}

export enum Season {
  Current = "current",
  BridgeBattle = "Bridge Battle",
  Elevation = "Elevation",
  CleanSweep = "Clean Sweep",
  RoundUp = "Round Up",
  Gateway = "Gateway",
  SackAttack = "Sack Attack",
  TossUp = "Toss Up",
  Skyrise = "Skyrise",
  NothingButNet = "Nothing But Net",
  Starstruck = "Starstruck",
  InTheZone = "In the Zone",
  TurningPoint = "Turning Point",
  TowerTakeover = "Tower Takeover",
}

export interface SeasonRanking {
  team: string;
  season: Season;
  program: Program;
  vrating_rank: number;
  vrating: number;
}

export interface SeasonSkill extends Skill {
  season_rank: number;
  season_attempts: number;
}

export interface Skill {
  sku: string;
  type: SkillType;
  rank: number;
  team: string;
  program: Program;
  attempts: number;
  score: number;
}

export enum SkillType {
  Driver = 0,
  Programming = 1,
  Robot = 2,
}

export interface Team {
  number: string;
  program: Program;
  team_name: string;
  robot_name: string;
  organisation: string;
  city: string;
  region: string;
  country: string;
  grade: Grade;
  is_registered: RegistrationStatus;
}
