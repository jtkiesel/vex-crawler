/*import pg, {QueryConfig} from 'pg';
import {VexDbV1Client} from './lib/vex-db/v1';
import {
  Award,
  Event,
  Match,
  Ranking,
  ScoredStatus,
  Skill,
  SkillsRequestBuilder,
  SkillType,
  Team,
} from './lib/vex-db/v1/clients';

const vexDbV1Client = new VexDbV1Client();
const pgPool = new pg.Pool();

export async function crawlTeams() {
  const pgClient = await pgPool.connect();

  const teams = vexDbV1Client.teams.findAll(request => request.limit(1000));
  while (await teams.hasNext()) {
    const team = await teams.next();
    console.log('team', team.number);
    await pgClient.query(teamFromVexDb(team));
  }
}

export async function crawlEvents() {
  const pgClient = await pgPool.connect();

  const events = vexDbV1Client.events.findAll(request => request.limit(1000));
  while (await events.hasNext()) {
    const event = await events.next();
    console.log('event', event.sku);
    try {
      await pgClient.query(eventFromVexDb(event));
    } catch (error) {
      console.error('EVENT ERROR', JSON.stringify(event), error);
    }
    const {
      rows: [{id: eventId, season_id: seasonId}],
    } = await pgClient.query<{id: number; season_id: number}>(
      `--sql
        select id from event where sku = $1`,
      [event.sku]
    );

    for (const division of event.divisions) {
      console.log('division', division);
      try {
        await pgClient.query(divisionFromVexDb(eventId, division));
      } catch (error) {
        console.error('DIVISION ERROR', JSON.stringify(division), error);
      }
      const {
        rows: [{id: divisionId}],
      } = await pgClient.query<{id: number}>(
        `--sql
          select id from division where name = $1`,
        [division]
      );

      const matches = vexDbV1Client.matches.findAll(request =>
        request.eventSku(event.sku).division(division)
      );
      while (await matches.hasNext()) {
        const match = await matches.next();
        console.log('match', match.round, match.instance, match.matchnum);
        try {
          await pgClient.query(matchFromVexDb(divisionId, match));
        } catch (error) {
          console.error('MATCH ERROR', JSON.stringify(match), error);
        }
        const {
          rows: [{id: matchId}],
        } = await pgClient.query<{id: number}>(
          `--sql
            select id from match
            where division_id = $1 and round = $2 and instance = $3 and number = $4`,
          [divisionId, match.round, match.instance, match.matchnum]
        );

        const {scored, redscore, bluescore} = match;
        console.log('alliance', 'red', redscore);
        try {
          await pgClient.query(
            `--sql
              insert into alliance (match_id, color, score)
              values ($1, $2, $3)
              on conflict (match_id, color) do nothing`,
            [matchId, 'red', scored === ScoredStatus.SCORED ? redscore : null]
          );
        } catch (error) {
          console.error('ALLIANCE ERROR', 'red', error);
        }
        console.log('alliance', 'blue', bluescore);
        try {
          await pgClient.query(
            `--sql
              insert into alliance (match_id, color, score)
              values ($1, $2, $3)
              on conflict (match_id, color) do nothing`,
            [matchId, 'blue', scored === ScoredStatus.SCORED ? bluescore : null]
          );
        } catch (error) {
          console.error('ALLIANCE ERROR', 'blue', error);
        }
        const [
          {
            rows: [{id: redAllianceId}],
          },
          {
            rows: [{id: blueAllianceId}],
          },
        ] = [
          await pgClient.query<{id: number}>(
            `--sql
              select id from alliance where match_id = $1 and color = $2`,
            [matchId, 'red']
          ),
          await pgClient.query<{id: number}>(
            `--sql
              select id from alliance where match_id = $1 and color = $2`,
            [matchId, 'blue']
          ),
        ];

        const {red1, red2, red3, redsit, blue1, blue2, blue3, bluesit} = match;
        const redTeams = [red1, red2, red3].filter(team => team);
        for (const team of redTeams) {
          const sitting = team === redsit;
          console.log('alliance team', 'red', team, sitting);
          try {
            await pgClient.query(
              `--sql
                insert into alliance_team (alliance_id, team_id, sitting)
                values ($1, (select id from team where program = (select program_id from season where id = $2) and number = $3), $4)
                on conflict (alliance_id, team_id) do nothing`,
              [redAllianceId, seasonId, team, sitting]
            );
          } catch (error) {
            console.error('ALLIANCE TEAM ERROR', JSON.stringify(team), error);
          }
        }
        const blueTeams = [blue1, blue2, blue3].filter(team => team);
        for (const team of blueTeams) {
          const sitting = team === bluesit;
          console.log('alliance team', 'blue', team, sitting);
          try {
            await pgClient.query(
              `--sql
                insert into alliance_team (alliance_id, team_id, sitting)
                values ($1, (select id from team where program = (select program_id from season where id = $2) and number = $3), $4)
                on conflict (alliance_id, team_id) do nothing`,
              [blueAllianceId, seasonId, team, sitting]
            );
          } catch (error) {
            console.error('ALLIANCE TEAM ERROR', JSON.stringify(team), error);
          }
        }
      }

      const rankings = vexDbV1Client.rankings.findAll(request =>
        request.eventSku(event.sku).division(division)
      );
      while (await rankings.hasNext()) {
        const ranking = await rankings.next();
        console.log('ranking', ranking.rank);
        try {
          await pgClient.query(rankingFromVexDb(divisionId, ranking));
        } catch (error) {
          console.error('RANKING ERROR', JSON.stringify(ranking), error);
        }
      }
    }

    const eventTeams = vexDbV1Client.teams.findAll(request =>
      request.eventSku(event.sku)
    );
    while (await eventTeams.hasNext()) {
      const team = await eventTeams.next();
      console.log('event team', team.number);
      try {
        await pgClient.query(eventTeamFromVexDb(eventId, team));
      } catch (error) {
        console.error('EVENT TEAM ERROR', JSON.stringify(team), error);
      }
    }

    const skills = await vexDbV1Client.skills
      .findAll(request => request.eventSku(event.sku).type(SkillType.DRIVER))
      .toArray();
    skills.push(
      ...(await vexDbV1Client.skills
        .findAll(request =>
          request.eventSku(event.sku).type(SkillType.PROGRAMMING)
        )
        .toArray())
    );
    for (const skill of skills) {
      console.log('skill', skill.rank);
      try {
        await pgClient.query(skillFromVexDb(eventId, skill));
      } catch (error) {
        console.error('SKILL ERROR', JSON.stringify(skill), error);
      }
    }

    const awards = vexDbV1Client.awards.findAllByEvent(event.id);
    while (await awards.hasNext()) {
      const award = await awards.next();
      console.log('award', award.title);
      try {
        await pgClient.query(awardFromVexDb(eventId, award));
      } catch (error) {
        console.error('AWARD ERROR', JSON.stringify(award), error);
      }
      const {
        rows: [{id: awardId}],
      } = await pgClient.query<{id: number}>(
        `--sql
          select id from award where vex_db_id = $1`,
        [award.id]
      );

      for (const qualification of award.qualifications) {
        console.log('award qualification', qualification);
        try {
          await pgClient.query(
            awardQualificationFromVexDb(awardId, qualification)
          );
        } catch (error) {
          console.error('AWARD QUALIFICATION ERROR', qualification, error);
        }
      }

      for (const winner of award.winners.filter(w => w.length)) {
        console.log('award winner', winner);
        try {
          if (/^([0-9]{1,5}[A-Z]?|[A-Z]{2,5}[0-9]{0,2})$/.test(winner)) {
            await pgClient.query(awardTeamFromVexDb(awardId, winner));
          } else {
            await pgClient.query(awardIndividualFromVexDb(awardId, winner));
          }
        } catch (error) {
          console.error('AWARD WINNER ERROR', winner, error);
        }
      }
    }
  }

  pgClient.release();
}

function teamFromVexDb(team: Team): QueryConfig {
  const {
    id,
    program,
    number,
    teamName,
    robotName,
    organisation,
    location: {city, region, country, lat, long},
    grade,
  } = team;
  return {
    text: `--sql
      insert into team (vex_db_id, program_id, number, name, robot, organization, city, region, country, coordinates, grade)
      values ($1, (select id from program where vex_db_id=$2), $3, $4, $5, $6, $7, $8, $9, ST_GeogFromText($10), $11)
      on conflict (vex_db_id) do nothing`,
    values: [
      id,
      program.id,
      number,
      teamName.trim() || null,
      robotName.trim() || null,
      organisation.trim() || null,
      city.trim() || null,
      region.trim() || null,
      country.trim() || null,
      coordinatesFromVexDb(lat, long),
      grade.title.toLowerCase() === 'elementary'
        ? 'elementary school'
        : grade.title.toLowerCase(),
    ],
  };
}

function eventFromVexDb(event: Event): QueryConfig {
  const {
    id,
    season,
    sku,
    name,
    start,
    end,
    location: {
      venue,
      address1,
      address2,
      city,
      region,
      postcode,
      country,
      lat,
      long,
    },
  } = event;
  return {
    text: `--sql
      insert into event (vex_db_id, season_id, sku, name, start, "end", venue, address1, address2, city, region, postcode, country, coordinates)
      values ($1, (select id from season where vex_db_id=$2), $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, ST_GeogFromText($14))
      on conflict (vex_db_id) do nothing`,
    values: [
      id,
      season.id,
      sku.trim() || null,
      name.trim() || null,
      dateFromVexDb(start),
      dateFromVexDb(end),
      venue.trim() || null,
      address1.trim() || null,
      address2.trim() || null,
      city.trim() || null,
      region.trim() || null,
      postcode.trim() || null,
      country.trim() || null,
      coordinatesFromVexDb(lat, long),
    ],
  };
}

function divisionFromVexDb(eventId: number, division: Division): QueryConfig {
  const {id, name, innerId} = division;
  return {
    text: `--sql
      insert into division (vex_db_id, event_id, name, "order")
      values ($1, $2, $3, $4)
      on conflict (vex_db_id) do nothing`,
    values: [id, eventId, name, innerId],
  };
}

function matchFromVexDb(divisionId: number, match: Match): QueryConfig {
  const {id, round, instance, matchnum, scheduled, field} = match;
  return {
    text: `--sql
      insert into match (vex_db_id, division_id, round, instance, number, scheduled, field)
      values ($1, $2, $3, $4, $5, $6, $7)
      on conflict (vex_db_id) do nothing`,
    values: [
      id,
      divisionId,
      round,
      instance,
      matchnum,
      dateFromVexDb(scheduled),
      field.trim() || null,
    ],
  };
}

function rankingFromVexDb(divisionId: number, ranking: Ranking): QueryConfig {
  const {team, id, rank, wins, losses, ties, wp, ap, sp, maxScore} = ranking;
  return {
    text: `--sql
      insert into ranking (division_id, team_id, vex_db_id, rank, wins, losses, ties, wp, ap, sp, max_score)
      values ($1, (select id from team where vex_db_id = $2), $3, $4, $5, $6, $7, $8, $9, $10, $11)
      on conflict (vex_db_id) do nothing`,
    values: [
      divisionId,
      team.id,
      id,
      rank,
      wins,
      losses,
      ties,
      wp,
      ap,
      sp,
      maxScore,
    ],
  };
}

function eventTeamFromVexDb(eventId: number, team: Team): QueryConfig {
  return {
    text: `--sql
      insert into event_team (event_id, team_id)
      values ($1, (select id from team where vex_db_id=$2))
      on conflict (event_id, team_id) do nothing`,
    values: [eventId, team.id],
  };
}

function skillFromVexDb(eventId: number, skill: Skill): QueryConfig {
  const {team, type, id, rank, score, attempts} = skill;
  return {
    text: `--sql
      insert into skill (event_id, team_id, type, vex_db_id, rank, score, attempts)
      values ($1, (select id from team where vex_db_id = $2), $3, $4, $5, $6, $7)
      on conflict (vex_db_id) do nothing`,
    values: [eventId, team.id, type, id, rank, score, attempts],
  };
}

function awardFromVexDb(eventId: number, award: Award): QueryConfig {
  const {id, order, title} = award;
  return {
    text: `--sql
      insert into award (vex_db_id, event_id, "order", title)
      values ($1, $2, $3, $4)
      on conflict (vex_db_id) do nothing`,
    values: [id, eventId, order, title],
  };
}

function awardQualificationFromVexDb(
  awardId: number,
  qualification: string
): QueryConfig {
  return {
    text: `--sql
      insert into award_qualification (award_id, qualification)
      values ($1, $2)
      on conflict (award_id, qualification) do nothing`,
    values: [awardId, qualification],
  };
}

function awardTeamFromVexDb(awardId: number, teamNumber: string): QueryConfig {
  return {
    text: `--sql
      insert into award_team (award_id, team_id)
      values ($1, (select id from team where number = $2))
      on conflict (award_id, team_id) do nothing`,
    values: [awardId, teamNumber],
  };
}

function awardIndividualFromVexDb(
  awardId: number,
  individual: string
): QueryConfig {
  return {
    text: `--sql
      insert into award_individual (award_id, individual)
      values ($1, $2)
      on conflict (award_id, individual) do nothing`,
    values: [awardId, individual],
  };
}

function dateFromVexDb(date: string) {
  return Date.parse(date) > 0
    ? date.replace('+00:00', ' America/New_York')
    : null;
}

function coordinatesFromVexDb(latitude: number, longitude: number) {
  return latitude !== 0 && longitude !== 0
    ? `POINT(${longitude} ${latitude})`
    : null;
}*/
