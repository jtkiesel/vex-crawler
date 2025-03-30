export * from "./awards.js";
export * from "./events.js";
export * from "./matches.js";
export * from "./programs.js";
export * from "./rankings.js";
export * from "./seasons.js";
export * from "./skills.js";
export * from "./teams.js";

export interface AllianceTeam {
  team: IdInfo;
  sitting: boolean;
}

export interface Award {
  id: number;
  event: IdInfo;
  order: number;
  title: string;
  winners: string[]; // team numbers and individuals
  qualifications: string[]; // SKUs
}

export interface Division {
  id: number;
  innerId: number;
  name: string;
}

export interface Event {
  id: number;
  sku: string;
  name: string;
  start: string;
  end: string;
  season: IdInfo;
  program: IdInfo;
  location: EventLocation;
  divisions: Division[];
  isWorlds: boolean;
}

export interface EventLocation {
  venue: string;
  address1: string;
  address2: string;
  city: string;
  region: string;
  postcode: string;
  country: string;
  lat: number;
  long: number;
}

export enum Grade {
  College = 1,
  HighSchool = 2,
  MiddleSchool = 3,
  ElementarySchool = 4,
}

export interface IdInfo {
  id: number;
  title: string;
}

export interface Match {
  id: number;
  event: IdInfo;
  division: IdInfo;
  round: number;
  instance: number;
  matchnum: number;
  scheduled: string; // Might be new Date(0)
  field: string;
  redscore: number;
  bluescore: number;
  scored: boolean;
  redTeams: AllianceTeam[];
  blueTeams: AllianceTeam[];
}

export interface Program {
  id: number;
  name: string;
}

export interface Ranking {
  id: number;
  event: IdInfo;
  division: IdInfo;
  rank: number;
  team: IdInfo;
  wins: number;
  losses: number;
  ties: number;
  wp: number;
  ap: number;
  sp: number;
  trsp: number;
  maxScore: number;
  opr: number;
  dpr: number;
  ccwm: number;
}

export interface Season {
  id: number;
  name: string;
  program: IdInfo;
  start: string;
  end: string;
  skillsSpots: number;
  combinedSkills: boolean;
  hasAPs: boolean;
}

export interface Skill {
  id: number;
  event: IdInfo;
  team: IdInfo;
  type: SkillType;
  season: IdInfo;
  division: IdInfo;
  rank: number;
  score: number;
  attempts: number;
}

export enum SkillType {
  Driver = "driver",
  Programming = "programming",
  Robot = "robot",
}

export interface Team {
  id: number;
  number: string;
  teamName: string;
  robotName: string;
  organisation: string;
  location: TeamLocation;
  registered: boolean;
  program: IdInfo;
  grade: IdInfo;
}

export interface TeamLocation {
  city: string;
  region: string; // might be ""
  country: string;
  lat: number; // might be 0
  long: number; // might be 0
}
