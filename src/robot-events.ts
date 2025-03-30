import {
  RobotEventsClient,
  EventLevel as RobotEventsEventLevel,
  EventType as RobotEventsEventType,
  type Event as RobotEventsEvent,
  type Team as RobotEventsTeam,
} from "@robotevents/client";
import pg from "pg";
import { robotEventsToken } from "./lib/config.js";
import {
  EventLevel,
  EventType,
  diff,
  type Event,
} from "./lib/vex-archive/index.js";

const robotEventsClient = new RobotEventsClient({ token: robotEventsToken });
const pgPool = new pg.Pool();

export async function crawlPrograms() {
  const pgClient = await pgPool.connect();

  const programs = robotEventsClient.programs.findAll((r) => r.perPage(1000));
  while (await programs.hasNext()) {
    const program = await programs.next();
    console.log("program", program.abbr);
    try {
      await pgClient.query(
        `--sql
          insert into program (robot_events_id, code, name)
          values ($1, $2, $3)
          on conflict do nothing
        `,
        [program.id, program.abbr, program.name],
      );
    } catch (error) {
      console.error("PROGRAM ERROR", program, error);
    }
  }
}

export async function crawlTeams() {
  const pgClient = await pgPool.connect();

  const teams = robotEventsClient.teams.findAll((r) => r.perPage(1000));
  while (await teams.hasNext()) {
    const team = await teams.next();
    console.log("team", team.number);
    try {
      await pgClient.query(teamFromRobotEvents(team));
    } catch (error) {
      console.error("TEAM ERROR", team, error);
    }
  }
  console.log("TEAMS DONE");
}

export async function crawlEvents() {
  const pgClient = await pgPool.connect();

  /*const seasonIds = await robotEventsClient.seasons
    .findAll(r => r.perPage(1000))
    .map(({id}) => id)
    .toArray();*/

  const events = robotEventsClient.events.findAll((r) => r.perPage(1000));
  while (await events.hasNext()) {
    const event = eventFromRobotEvents(await events.next());
    const eventResult = await pgClient.query<Event>(
      `--sql
        select * from event
        where sku = $1`,
      [event.sku],
    );
    if (eventResult.rows.length) {
      const [oldEvent] = eventResult.rows;
      const eventDiff = diff(oldEvent, event);
      if (eventDiff) {
        console.log("EVENT DIFF", event.sku, ":", eventDiff);
      }
    }
  }
  console.log("EVENTS DONE");
}

function teamFromRobotEvents(team: RobotEventsTeam): pg.QueryConfig {
  const {
    id,
    program,
    number,
    team_name,
    robot_name,
    organization,
    location: {
      city,
      region,
      postcode,
      country,
      coordinates: { lat, lon },
    },
    grade,
  } = team;
  return {
    text: `--sql
      insert into team (robot_events_id, program_id, number, name, robot, organization, city, region, postcode, country, coordinates, grade)
      values ($1, (select id from program where robot_events_id = $2), $3, $4, $5, $6, $7, $8, $9, $10, ST_GeogFromText($11), $12)
      on conflict (program_id, number) do update set name = excluded.name, robot = excluded.robot, organization = excluded.organization, city = excluded.city, region = excluded.region, postcode = excluded.postcode, country = excluded.country, coordinates = excluded.coordinates, grade = excluded.grade`,
    values: [
      id,
      program.id,
      number,
      team_name,
      robot_name?.length ? robot_name : null,
      organization,
      city,
      region,
      postcode,
      country,
      lat !== 0 && lon !== 0 ? `POINT(${lon} ${lat})` : null,
      grade.toLowerCase(),
    ],
  };
}

function eventFromRobotEvents(event: RobotEventsEvent) {
  const {
    id,
    season,
    sku,
    name,
    start,
    end,
    location: {
      venue,
      address_1,
      address_2,
      city,
      region,
      postcode,
      country,
      coordinates: { lat, lon },
    },
    level,
    event_type,
  } = event;
  return {
    robot_events_id: id,
    robot_events_season_id: season.id,
    sku,
    name,
    start: start ?? null,
    end: end ?? null,
    venue,
    address1: address_1,
    address2: address_2,
    city,
    region,
    postcode,
    country,
    latitude: lat,
    longitude: lon,
    level: eventLevelFromRobotEvents(level),
    type: eventTypeFromRobotEvents(event_type),
  };
}

function eventLevelFromRobotEvents(level?: RobotEventsEventLevel) {
  switch (level) {
    case RobotEventsEventLevel.World:
      return EventLevel.World;
    case RobotEventsEventLevel.National:
      return EventLevel.National;
    case RobotEventsEventLevel.Regional:
      return EventLevel.Regional;
    case RobotEventsEventLevel.State:
      return EventLevel.State;
    case RobotEventsEventLevel.Signature:
      return EventLevel.Signature;
    case RobotEventsEventLevel.Other:
      return EventLevel.Other;
    default:
      return null;
  }
}

function eventTypeFromRobotEvents(type: RobotEventsEventType | null) {
  switch (type) {
    case RobotEventsEventType.Tournament:
      return EventType.Tournament;
    case RobotEventsEventType.League:
      return EventType.League;
    case RobotEventsEventType.Workshop:
      return EventType.Workshop;
    case RobotEventsEventType.Virtual:
      return EventType.Virtual;
    default:
      return null;
  }
}
