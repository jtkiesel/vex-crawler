create database vexstats;

\connect vexstats

create schema vex;

create table vex.program (
  id integer generated always as identity primary key,
  robot_events_id integer unique,
  vex_db_id integer unique,
  code text not null unique,
  name text not null
);

comment on table vex.program is 'A VEX program.';
comment on column vex.program.id is 'The unique identifier for the program.';
comment on column vex.program.robot_events_id is 'The unique identifier for the program in the Robot Events API.';
comment on column vex.program.vex_db_id is 'The unique identifier for the program in the VexDB API.';
comment on column vex.program.code is 'The unique abbreviated name of the program.';
comment on column vex.program.name is 'The name of the program.';

create table vex.season (
  id integer generated always as identity primary key,
  robot_events_id integer unique,
  vex_db_id integer unique,
  program_id integer references vex.program not null,
  name text not null,
  start timestamptz not null,
  "end" timestamptz not null,
  unique (program_id, name)
);

comment on table vex.season is 'A season of a program.';
comment on column vex.season.id is 'The unique identifier for the season.';
comment on column vex.season.robot_events_id is 'The unique identifier for the season in the Robot Events API.';
comment on column vex.season.vex_db_id is 'The unique identifier for the season in the VexDB API.';
comment on column vex.season.program_id is 'The unique identifier for the program of the season.';
comment on column vex.season.name is 'The name of the season.';
comment on column vex.season.start is 'The datetime of the start of the season.';
comment on column vex.season.end is 'The datetime of the end of the season.';

create table vex.team (
  id integer generated always as identity primary key,
  robot_events_id integer unique,
  vex_db_id integer unique,
  program_id integer references vex.program not null,
  number text not null,
  unique (program_id, number)
);

comment on table vex.team is 'A team of a program.';
comment on column vex.team.id is 'The unique identifier for the team.';
comment on column vex.team.program_id is 'The unique identifier for the program of the team.';
comment on column vex.team.number is 'The number of the team.';

create extension postgis;

create type vex.grade as enum (
  'college',
  'high school',
  'middle school',
  'elementary school'
);

create table vex.season_team (
  id integer generated always as identity primary key,
  season_id integer references vex.season not null,
  team_id integer references vex.team not null,
  name text,
  robot text,
  organization text,
  city text,
  region text,
  postcode text,
  country text,
  coordinates geography(point),
  grade vex.grade,
  sponsors text,
  unique (season_id, team_id)
);

create collation numeric (provider = icu, locale = 'en-u-kn-true');

alter table vex.team alter column number type text collate numeric;

comment on table vex.season_team is 'A team of a season.';
comment on column vex.season_team.id is 'The unique identifier for the season team.';
comment on column vex.season_team.season_id is 'The unique identifier for the season of the team.';
comment on column vex.season_team.team_id is 'The unique identifier for the team.';
comment on column vex.season_team.name is 'The name of the team.';
comment on column vex.season_team.robot is 'The robot of the team.';
comment on column vex.season_team.organization is 'The organization of the team.';
comment on column vex.season_team.city is 'The city of the team.';
comment on column vex.season_team.region is 'The region of the team.';
comment on column vex.season_team.postcode is 'The postcode of the team.';
comment on column vex.season_team.country is 'The country of the team.';
comment on column vex.season_team.coordinates is 'The geographic coordinates of the team.';
comment on column vex.season_team.grade is 'The grade of the team.';

create type vex.event_level as enum (
  'world',
  'national',
  'regional',
  'state',
  'signature',
  'other'
);

create type vex.event_type as enum (
  'tournament',
  'league',
  'workshop',
  'virtual'
);

create table vex.event (
  id integer generated always as identity primary key,
  robot_events_id integer unique,
  vex_db_id integer unique,
  season_id integer references vex.season,
  code text unique,
  via_modified integer,
  name text,
  level vex.event_level,
  type vex.event_type
);

comment on table vex.event is 'An event of a season.';
comment on column vex.event.id is 'The unique identifier for the event.';
comment on column vex.event.robot_events_id is 'The unique identifier for the event in the Robot Events API.';
comment on column vex.event.vex_db_id is 'The unique identifier for the event in the VexDB API.';
comment on column vex.event.season_id is 'The unique identifier for the season of the event.';
comment on column vex.event.code is 'The Robot Events code of the event.';
comment on column vex.event.name is 'The name of the event.';
comment on column vex.event.level is 'The level of the event.';
comment on column vex.event.type is 'The type of the event.';

create table vex.event_session (
  id integer generated always as identity primary key,
  event_id integer references vex.event not null,
  start timestamptz,
  "end" timestamptz,
  venue text,
  address1 text,
  address2 text,
  city text,
  region text,
  postcode text,
  country text,
  coordinates geography(point),
  unique (event_id, start)
);

comment on table vex.event_session is 'A session of an event. League events have multiple datetime ranges and locations.';
comment on column vex.event_session.start is 'The datetime of the start of the event session.';
comment on column vex.event_session.end is 'The datetime of the end of the event session.';
comment on column vex.event_session.venue is 'The venue hosting the event session.';
comment on column vex.event_session.address1 is 'The primary address of the event session.';
comment on column vex.event_session.address2 is 'The secondary address of the event session.';
comment on column vex.event_session.city is 'The city of the event session.';
comment on column vex.event_session.region is 'The region of the event session.';
comment on column vex.event_session.postcode is 'The postcode of the event session.';
comment on column vex.event_session.country is 'The country of the event session.';
comment on column vex.event_session.coordinates is 'The geographic coordinates of the event session.';

create table vex.division (
  id integer generated always as identity primary key,
  robot_events_event_id integer references vex.event(robot_events_id),
  robot_events_id integer,
  vex_db_id integer unique,
  event_id integer references vex.event not null,
  number smallint not null,
  name text,
  unique (robot_events_event_id, robot_events_id),
  unique (event_id, number)
);

create type vex.match_round as enum (
  'practice',
  'qualification',
  'top n',
  'round robin',
  'round of 128',
  'round of 64',
  'round of 32',
  'round of 16',
  'quarterfinal',
  'semifinal',
  'final'
);

create table vex.match (
  id integer generated always as identity primary key,
  robot_events_id integer unique,
  vex_db_id integer unique,
  division_id integer references vex.division not null,
  round vex.match_round not null,
  instance smallint not null,
  number smallint not null,
  field text,
  scheduled timestamptz,
  started timestamptz,
  resumed timestamptz,
  scored timestamptz,
  unique (division_id, round, instance, number)
);

create table vex.alliance (
  id integer generated always as identity primary key,
  match_id integer references vex.match not null,
  number smallint not null,
  score smallint,
  disqualified boolean,
  unique (match_id, number)
);

create table vex.alliance_team (
  alliance_id integer references vex.alliance not null,
  team_id integer references vex.team not null,
  sitting boolean,
  primary key (alliance_id, team_id)
);

create table vex.alliance_score (
  id integer generated always as identity primary key,
  alliance_id integer references vex.alliance not null,
  name text not null,
  value smallint not null,
  unique (alliance_id, name)
);

create table vex.ranking (
  id integer generated always as identity primary key,
  division_id integer references vex.division not null,
  round vex.match_round not null,
  team_id integer references vex.team not null,
  robot_events_id integer unique,
  vex_db_id integer unique,
  rank smallint not null,
  wp smallint not null,
  ap smallint,
  sp smallint not null,
  wins smallint not null,
  losses smallint not null,
  ties smallint not null,
  total_matches smallint not null,
  average_score numeric(5, 2),
  max_score smallint,
  total_score smallint,
  unique (division_id, round, team_id)
);

create table vex.statistics (
  division_id integer references vex.division not null,
  team_id integer references vex.team not null,
  opr numeric(5, 2) not null,
  dpr numeric(5, 2) not null,
  ccwm numeric(5, 2) not null,
  primary key (division_id, team_id)
);

create table vex.event_team (
  event_id integer references vex.event not null,
  team_id integer references vex.team not null,
  primary key (event_id, team_id)
);

create type vex.skill_type as enum ('driver', 'programming');

create table vex.skill (
  id integer generated always as identity primary key,
  event_id integer references vex.event not null,
  team_id integer references vex.team not null,
  type vex.skill_type not null,
  robot_events_id integer unique,
  vex_db_id integer unique,
  rank smallint not null,
  score smallint not null,
  attempts smallint not null,
  unique (event_id, team_id, type)
);

create table vex.award (
  id integer generated always as identity primary key,
  robot_events_id integer unique,
  vex_db_id integer unique,
  division_id integer references vex.division not null,
  name text not null,
  "order" integer not null,
  unique (division_id, name),
  unique (division_id, "order")
);

create table vex.award_team (
  award_id integer references vex.award not null,
  team_id integer references vex.team not null,
  primary key (award_id, team_id)
);

create table vex.award_individual (
  id integer generated always as identity primary key,
  award_id integer references vex.award not null,
  individual text not null,
  unique (award_id, individual)
);

create table vex.award_qualification (
  id integer generated always as identity primary key,
  award_id integer references vex.award not null,
  qualification text not null,
  unique (award_id, qualification)
);
