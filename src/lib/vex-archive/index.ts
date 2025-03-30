export function diff(a: { [x: string]: any }, b: { [x: string]: any }) {
  const keys = Object.keys(a)
    .filter((key) => Object.hasOwn(b, key))
    .filter((key) => a[key] !== b[key]);
  if (!keys.length) {
    return;
  }
  return Object.fromEntries(keys.map((key) => [key, `${a[key]} => ${b[key]}`]));
}

export interface Alliance {
  id: number;
  match_id: number;
  color: AllianceColor;
  score: number | null;
}

export enum AllianceColor {
  Red = "red",
  Blue = "blue",
}

export interface AllianceScore {
  alliance_id: number;
  name: string;
  value: number;
}

export interface AllianceTeam {
  alliance_id: number;
  team_id: number;
  sitting: boolean | null;
}

export interface Award {
  id: number;
  robot_events_id: number | null;
  vex_db_id: number | null;
  event_id: number;
  order: number;
  title: string;
}

export interface AwardIndividual {
  award_id: number;
  individual: string;
}

export interface AwardQualification {
  award_id: number;
  qualification: string;
}

export interface AwardTeam {
  award_id: number;
  team_id: number;
}

export interface Division {
  id: number;
  robot_events_event_id: number | null;
  robot_events_id: number | null;
  vex_db_id: number | null;
  event_session_id: number;
  name: string;
  order: number;
}

export interface Event {
  id: number;
  robot_events_id: number | null;
  vex_db_id: number | null;
  season_id: number;
  sku: string | null;
  name: string;
  level: EventLevel | null;
  type: EventType | null;
}

export enum EventLevel {
  World = "world",
  National = "national",
  Regional = "regional",
  State = "state",
  Signature = "signature",
  Other = "other",
}

export interface EventSession {
  id: number;
  event_id: number;
  start: Date | null;
  end: Date | null;
  venue: string | null;
  address1: string | null;
  address2: string | null;
  city: string | null;
  region: string | null;
  postcode: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
}

export interface EventTeam {
  event_id: number;
  team_id: number;
}

export enum EventType {
  Tournament = "tournament",
  League = "league",
  Workshop = "workshop",
  Virtual = "virtual",
}

export enum Grade {
  College = "college",
  HighSchool = "high school",
  MiddleSchool = "middle school",
  ElementarySchool = "elementary school",
}

export interface Match {
  id: number;
  robot_events_id: number | null;
  vex_db_id: number | null;
  division_id: number;
  round: MatchRound;
  instance: number;
  number: number;
  scheduled: Date;
  started: Date;
  field: string;
}

export enum MatchRound {
  Practice = "practice",
  Qualification = "qualification",
  TopN = "top n",
  RoundRobin = "round robin",
  RoundOf128 = "round of 128",
  RoundOf64 = "round of 64",
  RoundOf32 = "round of 32",
  RoundOf16 = "round of 16",
  Quarterfinal = "quarterfinal",
  Semifinal = "semifinal",
  Final = "final",
}

export interface Program {
  id: number;
  robot_events_id: number | null;
  vex_db_id: number | null;
  code: string;
  name: string;
}

export interface Ranking {
  division_id: number;
  team_id: number;
  robot_events_id: number | null;
  vex_db_id: number | null;
  rank: number;
  wins: number;
  losses: number;
  ties: number;
  wp: number;
  ap: number | null;
  sp: number;
  max_score: number | null;
  total_score: number | null;
}

export interface Season {
  id: number;
  robot_events_id: number | null;
  vex_db_id: number | null;
  program_id: number;
  name: string;
  start: Date;
  end: Date;
}

export interface Skill {
  event_id: number;
  team_id: number;
  type: SkillType;
  robot_events_id: number | null;
  vex_db_id: number | null;
  rank: number;
  score: number;
  attempts: number;
}

export enum SkillType {
  Driver = "driver",
  Programming = "programming",
}

export interface Team {
  id: number;
  robot_events_id: number | null;
  vex_db_id: number | null;
  program_id: number;
  number: string;
  name: string | null;
  robot: string | null;
  organization: string | null;
  city: string | null;
  region: string | null;
  postcode: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  grade: Grade | null;
}
