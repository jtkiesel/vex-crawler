import geoTz from "geo-tz";
import type { QueryConfig } from "pg";
import { pool } from "./db.js";
import { Grade, MatchRound, SkillType } from "./lib/vex-archive/index.js";
import {
  Award,
  AwardType,
  Division,
  Event,
  EventTeam,
  Match,
  MatchState,
  Ranking,
  Round,
  Skill,
  Stats,
  Team,
  TeamAgeGroup,
} from "./lib/vex-via/clients/index.js";
import { VexViaClient } from "./lib/vex-via/index.js";

const schema = 211;
const viaSkuRegExp = /^re-(?<program>.+)-\d+-\d+$/i;
const vexViaClient = new VexViaClient();

export async function updateAllEvents() {
  return await updateTeamsEventsDivisionsAndEventTeams(0);
}

export async function updateDataForCurrentEvents() {
  const { rows: events } = await pool.query<{
    code: string;
    via_modified: number;
  }>(`--sql
    select code, via_modified
    from vex.event join vex.event_session on event.id = event_id
    where code is not null
      and via_modified is not null
      and now() between start and "end"`);
  console.log("current events:", events);
  return await updateDataForEvents(events);
}

export async function updateDataForPastEvents(milliseconds: number) {
  const { rows: events } = await pool.query<{
    code: string;
    via_modified: number;
  }>({
    text: `--sql
      select code, via_modified
      from vex.event join vex.event_session on event.id = event_id
      where code is not null
        and via_modified is not null
        and "end" between now() - $1 * interval '1 milliseconds' and now()`,
    values: [milliseconds],
  });
  console.log("recent events:", events);
  return await updateDataForEvents(events);
}

export async function updateDataForFutureEvents(milliseconds: number) {
  const { rows: events } = await pool.query<{
    code: string;
    via_modified: number;
  }>({
    text: `--sql
      select code, via_modified
      from vex.event join vex.event_session on event.id = event_id
      where code is not null
        and via_modified is not null
        and start between now() and now() + $1 * interval '1 milliseconds'`,
    values: [milliseconds],
  });
  console.log("upcoming events:", events);
  return await updateDataForEvents(events);
}

async function updateDataForEvents(
  events: { code: string; via_modified: number }[],
) {
  await Promise.all(
    events.map(({ code, via_modified }) =>
      updateMatchesRankingsStatsSkillsAndAwards(
        code.toLowerCase(),
        schema,
        via_modified,
      ),
    ),
  );
}

async function updateTeamsEventsDivisionsAndEventTeams(since: number) {
  const eventsCursor = vexViaClient.events.findAll((r) =>
    r.schema(schema).since(since),
  );
  while (await eventsCursor.hasNext()) {
    const eventsPage = await eventsCursor.nextPage();

    await Promise.all([
      ...eventsPage
        .filter((o): o is Team => o instanceof Team)
        .filter(({ number }) => number)
        .map(async (viaTeam) => {
          const team = teamFromVia(viaTeam);
          try {
            await pool.query(team);
          } catch (error) {
            console.error(
              "TEAM ERROR",
              error,
              JSON.stringify(viaTeam),
              team.values,
            );
          }
          const seasonTeam = seasonTeamFromVia(viaTeam, new Date());
          try {
            await pool.query(seasonTeam);
          } catch (error) {
            console.error(
              "SEASON TEAM ERROR",
              error,
              JSON.stringify(viaTeam),
              seasonTeam.values,
            );
          }
        }),
      ...eventsPage
        .filter((o): o is Event => o instanceof Event)
        .filter((viaEvent) => {
          if (validSku(viaEvent.sku)) {
            return true;
          }
          console.error(
            "INVALID SKU, SKIPPING EVENT",
            JSON.stringify(viaEvent),
          );
          return false;
        })
        .map(async (viaEvent) => {
          const event = eventFromVia(viaEvent);
          try {
            await pool.query(event);
          } catch (error) {
            console.error(
              "EVENT ERROR",
              error,
              JSON.stringify(viaEvent),
              event.values,
            );
          }
          const eventSession = eventSessionFromVia(viaEvent);
          try {
            await pool.query(eventSession);
          } catch (error) {
            console.error(
              "EVENT SESSION ERROR",
              error,
              JSON.stringify(viaEvent),
              eventSession.values,
            );
          }
        }),
      ...eventsPage
        .filter((o): o is Division => o instanceof Division)
        .filter((viaDivision) => {
          if (validSku(viaDivision.sku)) {
            return true;
          }
          console.warn("INVALID SKU, SKIPPING DIVISION", viaDivision);
          return false;
        })
        .map(async (viaDivision) => {
          const division = divisionFromVia(viaDivision);
          for (const query of division) {
            try {
              await pool.query(query);
            } catch (error) {
              console.error(
                "DIVISION ERROR",
                error,
                JSON.stringify(viaDivision),
                query.values,
              );
              break;
            }
          }
        }),
      ...[
        ...eventsPage
          .filter((o): o is EventTeam => o instanceof EventTeam)
          .reduce(
            (map, eventTeam) =>
              map.set(eventTeam.sku, [
                ...(map.get(eventTeam.sku) ?? []),
                eventTeam,
              ]),
            new Map<string, EventTeam[]>(),
          )
          .entries(),
      ]
        .filter(([viaSku, viaEventTeams]) => {
          if (validSku(viaSku)) {
            return true;
          }
          console.warn(
            "INVALID SKU, SKIPPING EVENT TEAMS",
            JSON.stringify(viaEventTeams),
          );
          return false;
        })
        .flatMap(([, viaEventTeams]) => viaEventTeams)
        .map(async (viaEventTeam) => {
          const eventTeam = eventTeamFromVia(viaEventTeam);
          for (const query of eventTeam) {
            try {
              await pool.query(query);
            } catch (error) {
              console.error(
                "EVENT TEAM ERROR",
                error,
                JSON.stringify(viaEventTeam),
                query.values,
              );
              break;
            }
          }
        }),
    ]);
  }
}

async function updateMatchesRankingsStatsSkillsAndAwards(
  sku: string,
  schema: number,
  since: number,
) {
  const eventCursor = vexViaClient.events.findBySku((r) =>
    r.sku(sku).schema(schema).since(since),
  );
  while (await eventCursor.hasNext()) {
    const eventPage = await eventCursor.nextPage();

    await Promise.all([
      ...eventPage
        .filter((o): o is Match => o instanceof Match)
        .map(async (viaMatch) => {
          const match = matchFromVia(viaMatch);
          for (const query of match) {
            try {
              await pool.query(query);
            } catch (error) {
              console.error(
                "MATCH ERROR",
                error,
                JSON.stringify(viaMatch),
                query.values,
              );
              break;
            }
          }
          const alliances = alliancesFromVia(viaMatch);
          try {
            await Promise.all(
              alliances.map((alliance) => pool.query(alliance)),
            );
          } catch (error) {
            console.error(
              "ALLIANCES ERROR",
              error,
              JSON.stringify(viaMatch),
              alliances.map(({ values }) => values),
            );
          }
          const allianceTeams = allianceTeamsFromVia(viaMatch);
          const allianceScores = allianceScoresFromVia(viaMatch);
          await Promise.all([
            ...allianceTeams.map(async (allianceTeam) => {
              for (const query of allianceTeam) {
                try {
                  await pool.query(query);
                } catch (error) {
                  console.error(
                    "ALLIANCE TEAM ERROR",
                    error,
                    JSON.stringify(viaMatch),
                    query.values,
                  );
                  break;
                }
              }
            }),
            ...allianceScores.map(async (allianceScore) => {
              try {
                await pool.query(allianceScore);
              } catch (error) {
                console.error(
                  "ALLIANCE SCORE ERROR",
                  error,
                  JSON.stringify(viaMatch),
                  allianceScore.values,
                );
              }
            }),
          ]);
        }),
      (async () => {
        const pgClient = await pool.connect();
        try {
          await pgClient.query(
            `--sql
            begin`,
          );

          await Promise.all(
            eventPage
              .filter((o): o is Ranking => o instanceof Ranking)
              .map(async (viaRanking) => {
                const ranking = rankingFromVia(viaRanking);
                for (const query of ranking) {
                  try {
                    await pgClient.query(query);
                  } catch (error) {
                    console.error(
                      "RANKING ERROR",
                      error,
                      JSON.stringify(viaRanking),
                      query.values,
                    );
                    throw error;
                  }
                }
              }),
          );
          await pgClient.query(
            `--sql
            commit`,
          );
        } catch (error) {
          console.log("RANKING ERROR", error);
          await pgClient.query(
            `--sql
            rollback`,
          );
        } finally {
          pgClient.release();
        }
      })(),
      ...eventPage
        .filter((o): o is Stats => o instanceof Stats)
        .map(async (viaStats) => {
          const statistics = statisticsFromVia(viaStats);
          for (const query of statistics) {
            try {
              await pool.query(query);
            } catch (error) {
              console.error(
                "STATISTICS ERROR",
                error,
                JSON.stringify(viaStats),
                query.values,
              );
            }
          }
        }),
      (async () => {
        const pgClient = await pool.connect();
        try {
          await pgClient.query(
            `--sql
            begin`,
          );

          await Promise.all(
            eventPage
              .filter((o): o is Skill => o instanceof Skill)
              .map(async (viaSkill) => {
                const skills = skillsFromVia(viaSkill);
                for (const query of skills) {
                  try {
                    await pool.query(query);
                  } catch (error) {
                    console.error(
                      "SKILL ERROR",
                      error,
                      JSON.stringify(viaSkill),
                      query.values,
                    );
                    break;
                  }
                }
              }),
          );
          await pgClient.query(
            `--sql
            commit`,
          );
        } catch (error) {
          console.log("RANKING ERROR", error);
          await pgClient.query(
            `--sql
            rollback`,
          );
        } finally {
          pgClient.release();
        }
      })(),
      ...[
        ...eventPage
          .filter((o): o is Award => o instanceof Award)
          .reduce(
            (map, award) =>
              map.set([award.division, award.name].join(), [
                ...(map.get([award.division, award.name].join()) ?? []),
                award,
              ]),
            new Map<string, Award[]>(),
          )
          .entries(),
      ].map(async ([, viaAwards]) => {
        const [{ division, name, id }] = viaAwards.toSorted(
          (a, b) => b.id - a.id,
        );
        const award = awardFromVia(sku, division, name, id);
        for (const query of award) {
          try {
            await pool.query(query);
          } catch (error) {
            console.error(
              "AWARD ERROR",
              error,
              JSON.stringify(viaAwards),
              query.values,
            );
            break;
          }
        }
        await Promise.all(
          viaAwards.map(async (viaAward) => {
            if (viaAward.type === AwardType.Team && viaAward.teamnum) {
              const awardTeam = awardTeamFromVia(viaAward);
              for (const query of awardTeam) {
                try {
                  await pool.query(query);
                } catch (error) {
                  console.error(
                    "AWARD TEAM ERROR",
                    error,
                    JSON.stringify(viaAward),
                    query.values,
                  );
                  break;
                }
              }
            } else if (viaAward.recipient) {
              const awardIndividual = awardIndividualFromVia(viaAward);
              try {
                await pool.query(awardIndividual);
              } catch (error) {
                console.error(
                  "AWARD INDIVIDUAL ERROR",
                  error,
                  JSON.stringify(viaAward),
                  awardIndividual.values,
                );
              }
            }
          }),
        );
      }),
    ]);
    await pool.query({
      text: `--sql
        update vex.event set via_modified = $1 where code = $2`,
      values: [
        Math.max(...eventPage.map(({ modified }) => modified)),
        skuFromVia(sku),
      ],
    });
  }
}

function teamFromVia(team: Team): QueryConfig {
  const { program, number } = team;
  return {
    text: `--sql
      insert into vex.team (program_id, number)
      values ((select id from vex.program where code = $1), $2)
      on conflict (program_id, number) do nothing`,
    values: [programFromVia(program), number],
  };
}

function seasonTeamFromVia(team: Team, date: Date): QueryConfig {
  const {
    program,
    number,
    name,
    city,
    state: region,
    country,
    school: organization,
    sponsors,
    ageGroup,
  } = team;
  return {
    text: `--sql
      insert into vex.season_team (
        season_id,
        team_id,
        name,
        organization,
        city,
        region,
        country,
        grade,
        sponsors
      )
      values (
        coalesce(
          (
            select id from vex.season
            where program_id = (select id from vex.program where code = $1)
              and $2 between start and "end"
          ),
          (
            select id from vex.season
            where program_id = (select id from vex.program where code = $1)
            order by "end" desc
            limit 1
          )
        ),
        (
          select id from vex.team
          where program_id = (select id from vex.program where code = $1)
            and number = $3
        ),
        $4,
        $5,
        $6,
        $7,
        $8,
        $9,
        $10
      )
      on conflict (season_id, team_id) do update set (
        name,
        organization,
        city,
        region,
        country,
        grade,
        sponsors
      ) = (
        excluded.name,
        excluded.organization,
        excluded.city,
        excluded.region,
        excluded.country,
        excluded.grade,
        excluded.sponsors
      )`,
    values: [
      programFromVia(program),
      date,
      number,
      name,
      organization,
      city,
      region,
      country,
      gradeFromViaTeam(ageGroup),
      sponsors,
    ],
  };
}

function eventFromVia(event: Event): QueryConfig {
  const { program, season, sku, name } = event;
  return {
    text: `--sql
      insert into vex.event (season_id, code, via_modified, name)
      values (
        (
          select id from vex.season
          where program_id = (select id from vex.program where code = $1)
            and start between $2 and $3
          limit 1
        ),
        $4,
        $5,
        $6
      )
      on conflict (code) do update set (season_id, via_modified, name) = (
        excluded.season_id,
        coalesce(event.via_modified, excluded.via_modified),
        excluded.name
      )`,
    values: [
      programFromVia(program),
      ...season.split("-").map((year) => `${year}-01-01`),
      skuFromVia(sku),
      0,
      name,
    ],
  };
}

function eventSessionFromVia(event: Event): QueryConfig {
  const {
    sku,
    date_start,
    date_end,
    venue,
    address1,
    address2,
    city,
    region,
    postcode,
    country,
    lat,
    long,
  } = event;
  const timeZone = lat !== 0 || long !== 0 ? geoTz.find(lat, long)[0] : "UTC";
  return {
    text: `--sql
      insert into vex.event_session (
        event_id,
        start,
        "end",
        venue,
        address1,
        address2,
        city,
        region,
        postcode,
        country,
        coordinates
      )
      values (
        (select id from vex.event where code = $1),
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        $9,
        $10,
        ST_GeogFromText($11)
      )
      on conflict (event_id, start) do update set (
        "end",
        venue,
        address1,
        address2,
        city,
        region,
        postcode,
        country,
        coordinates
      ) = (
        excluded.end,
        excluded.venue,
        excluded.address1,
        excluded.address2,
        excluded.city,
        excluded.region,
        excluded.postcode,
        excluded.country,
        excluded.coordinates
      )`,
    values: [
      skuFromVia(sku),
      `${date_start} ${timeZone}`,
      `${date_end} 23:59:59.999999 ${timeZone}`,
      venue,
      address1,
      address2,
      city,
      region,
      postcode,
      country,
      coordinatesFromVia(lat, long),
    ],
  };
}

function divisionFromVia(division: Division): QueryConfig[] {
  const { sku, id: number, name } = division;
  return [
    {
      text: `--sql
        insert into vex.event (code) values ($1) on conflict (code) do nothing`,
      values: [skuFromVia(sku)],
    },
    {
      text: `--sql
        insert into vex.division (event_id, number, name)
        values ((select id from vex.event where code = $1), $2, $3)
        on conflict (event_id, number) do update set name = excluded.name`,
      values: [skuFromVia(sku), number, name],
    },
  ];
}

function matchFromVia(match: Match): QueryConfig[] {
  const {
    sku,
    division,
    round,
    instance,
    match: number,
    data: {
      info: {
        timeScheduled,
        timeStarted,
        timeResumed,
        assignedField: { name: field },
      },
      scoreData,
    },
  } = match;
  return [
    {
      text: `--sql
        insert into vex.division (event_id, number)
        values ((select id from vex.event where code = $1), $2)
        on conflict (event_id, number) do nothing`,
      values: [skuFromVia(sku), division],
    },
    {
      text: `--sql
        insert into vex.match (
          division_id,
          round,
          instance,
          number,
          field,
          scheduled,
          started,
          resumed,
          scored
        )
        values (
          (
            select id from vex.division
            where event_id = (select id from vex.event where code = $1)
            and number = $2
          ),
          $3,
          $4,
          $5,
          $6,
          $7,
          $8,
          $9,
          $10
        )
        on conflict (division_id, round, instance, number) do update set (
          field,
          scheduled,
          started,
          resumed,
          scored
        ) = (
          excluded.field,
          excluded.scheduled,
          excluded.started,
          excluded.resumed,
          excluded.scored
        )`,
      values: [
        skuFromVia(sku),
        division,
        roundFromVia(round),
        instance,
        number,
        field || null,
        dateFromVia(timeScheduled),
        dateFromVia(timeStarted),
        dateFromVia(timeResumed),
        dateFromVia(scoreData?.timeSaved),
      ],
    },
  ];
}

function alliancesFromVia(match: Match): QueryConfig[] {
  const {
    sku,
    division,
    round,
    instance,
    match: number,
    data: {
      info: { state },
      finalScore: { allianceScores, allianceDqs },
    },
  } = match;
  return (
    allianceDqs.length > 0 && isIqSku(sku)
      ? [allianceDqs.every(Boolean)]
      : allianceDqs
  ).map((disqualified, index) => ({
    text: `--sql
      insert into vex.alliance (match_id, number, score, disqualified)
      values (
        (
          select id from vex.match
          where division_id = (
            select id from vex.division
            where event_id = (select id from vex.event where code = $1)
            and number = $2
          )
          and round = $3
          and instance = $4
          and number = $5
        ),
        $6,
        $7,
        $8
      )
      on conflict (match_id, number) do update set (score, disqualified) = (
        excluded.score,
        excluded.disqualified
      )`,
    values: [
      skuFromVia(sku),
      division,
      roundFromVia(round),
      instance,
      number,
      index + 1,
      state === MatchState.Scored ? allianceScores[index] : null,
      disqualified,
    ],
  }));
}

function allianceTeamsFromVia(match: Match): QueryConfig[][] {
  const {
    sku,
    division,
    round,
    instance,
    match: number,
    data: {
      info: { alliances },
      scoreData,
    },
  } = match;
  return alliances
    .map(({ teams }, index) => ({
      teams: teams.map(({ number }) => {
        const team = scoreData?.alliances[index].teams.find(
          (team): team is { teamNum: string; sitting: boolean } =>
            "teamNum" in team && team.teamNum === number,
        );
        return {
          number,
          sitting: team?.sitting ?? (teams.length < 3 ? false : null),
        };
      }),
    }))
    .reduce((alliances, alliance) => {
      if (alliances.length > 0 && isIqSku(sku)) {
        alliances[0].teams.push(...alliance.teams);
      } else {
        alliances.push(alliance);
      }
      return alliances;
    }, new Array<{ teams: { number: string; sitting: boolean | null }[] }>())
    .flatMap(({ teams }, index) =>
      teams.map(({ number: teamNumber, sitting }) => [
        {
          text: `--sql
            insert into vex.team (program_id, number)
            values ((select id from vex.program where code = $1), $2)
            on conflict (program_id, number) do nothing`,
          values: [programFromSku(sku), teamNumber],
        },
        {
          text: `--sql
            insert into vex.alliance_team (alliance_id, team_id, sitting)
            values (
              (
                select id from vex.alliance
                where match_id = (
                  select id from vex.match
                  where division_id = (
                    select id from vex.division
                    where event_id = (select id from vex.event where code = $1)
                    and number = $2
                  )
                  and round = $3
                  and instance = $4
                  and number = $5
                )
                and number = $6
              ),
              (
                select id from vex.team
                where program_id = (select id from vex.program where code = $7)
                and number = $8
              ),
              $9
            )
            on conflict (alliance_id, team_id)
              do update set sitting = excluded.sitting`,
          values: [
            skuFromVia(sku),
            division,
            roundFromVia(round),
            instance,
            number,
            index + 1,
            programFromSku(sku),
            teamNumber,
            sitting,
          ],
        },
      ]),
    );
}

function allianceScoresFromVia(match: Match): QueryConfig[] {
  const {
    sku,
    division,
    round,
    instance,
    match: number,
    data: { scoreData },
  } = match;
  return (
    scoreData?.state === MatchState.Scored
      ? scoreData.scoreTypes
        ? [scoreData.scoreTypes]
        : (isIqSku(sku)
            ? scoreData.alliances.splice(0, 1)
            : scoreData.alliances
          ).map(({ scoreTypes }) => scoreTypes ?? [])
      : []
  ).flatMap((scoreTypes, index) =>
    scoreTypes.map(({ name, val: value }) => ({
      text: `--sql
        insert into vex.alliance_score (alliance_id, name, value)
        values (
          (
            select id from vex.alliance
            where match_id = (
              select id from vex.match
              where division_id = (
                select id from vex.division
                where event_id = (select id from vex.event where code = $1)
                and number = $2
              )
              and round = $3
              and instance = $4
              and number = $5
            )
            and number = $6
          ),
          $7,
          $8
        )
        on conflict (alliance_id, name) do update set value = excluded.value`,
      values: [
        skuFromVia(sku),
        division,
        roundFromVia(round),
        instance,
        number,
        index + 1,
        name,
        value,
      ],
    })),
  );
}

function rankingFromVia(ranking: Ranking): QueryConfig[] {
  const {
    sku,
    division,
    round,
    teamnum: team,
    rank,
    wp,
    ap,
    sp,
    wins,
    losses,
    ties,
    numMatches: totalMatches,
    avgPoints: averageScore,
    highScore: maxScore,
    totalPoints: totalScore,
  } = ranking;
  return [
    {
      text: `--sql
        insert into vex.division (event_id, number)
        values ((select id from vex.event where code = $1), $2)
        on conflict (event_id, number) do nothing`,
      values: [skuFromVia(sku), division],
    },
    {
      text: `--sql
        insert into vex.team (program_id, number)
        values ((select id from vex.program where code = $1), $2)
        on conflict (program_id, number) do nothing`,
      values: [programFromSku(sku), team],
    },
    {
      text: `--sql
        insert into vex.ranking (
          division_id,
          round,
          team_id,
          rank,
          wp,
          ap,
          sp,
          wins,
          losses,
          ties,
          total_matches,
          average_score,
          max_score,
          total_score
        )
        values (
          (
            select id from vex.division
            where event_id = (select id from vex.event where code = $1)
            and number = $2
          ),
          $3,
          (
            select id from vex.team
            where program_id = (select id from vex.program where code = $4)
            and number = $5
          ),
          $6,
          $7,
          $8,
          $9,
          $10,
          $11,
          $12,
          $13,
          $14,
          $15,
          $16
        )
        on conflict (division_id, round, team_id) do update set (
          rank,
          wp,
          ap,
          sp,
          wins,
          losses,
          ties,
          total_matches,
          average_score,
          max_score,
          total_score
        ) = (
          excluded.rank,
          excluded.wp,
          excluded.ap,
          excluded.sp,
          excluded.wins,
          excluded.losses,
          excluded.ties,
          excluded.total_matches,
          excluded.average_score,
          excluded.max_score,
          excluded.total_score
        )`,
      values: [
        skuFromVia(sku),
        division,
        roundFromVia(round),
        programFromSku(sku),
        team,
        rank,
        wp,
        ap,
        sp,
        wins,
        losses,
        ties,
        totalMatches,
        averageScore,
        maxScore,
        totalScore,
      ],
    },
  ];
}

function statisticsFromVia(stats: Stats): QueryConfig[] {
  const { sku, division, teamnum: teamNumber, opr, dpr, ccwm } = stats;
  return [
    {
      text: `--sql
        insert into vex.team (program_id, number)
        values ((select id from vex.program where code = $1), $2)
        on conflict (program_id, number) do nothing`,
      values: [programFromSku(sku), teamNumber],
    },
    {
      text: `--sql
        insert into vex.statistics (division_id, team_id, opr, dpr, ccwm)
        values (
          (
            select id from vex.division
            where event_id = (select id from vex.event where code = $1)
            and number = $2
          ),
          (
            select id from vex.team
            where program_id = (select id from vex.program where code = $3)
            and number = $4
          ),
          $5,
          $6,
          $7
        )
        on conflict (division_id, team_id) do update set (opr, dpr, ccwm) = (
          excluded.opr,
          excluded.dpr,
          excluded.ccwm
        )`,
      values: [
        skuFromVia(sku),
        division,
        programFromSku(sku),
        teamNumber,
        opr,
        dpr,
        ccwm,
      ],
    },
  ];
}

function eventTeamFromVia(eventTeam: EventTeam): QueryConfig[] {
  const { program, sku, teamnum } = eventTeam;
  return [
    {
      text: `--sql
        insert into vex.event (code) values ($1) on conflict (code) do nothing`,
      values: [skuFromVia(sku)],
    },
    {
      text: `--sql
        insert into vex.team (program_id, number)
        values ((select id from vex.program where code = $1), $2)
        on conflict (program_id, number) do nothing`,
      values: [programFromVia(program), teamnum],
    },
    {
      text: `--sql
        insert into vex.event_team (event_id, team_id)
        values (
          (select id from vex.event where code = $1),
          (
            select id from vex.team
            where program_id = (select id from vex.program where code = $2)
            and number = $3
          )
        )
        on conflict (event_id, team_id) do nothing`,
      values: [skuFromVia(sku), programFromVia(program), teamnum],
    },
  ];
}

function skillsFromVia(skill: Skill): QueryConfig[] {
  const {
    sku,
    teamnum: team,
    rank,
    driverAttempts,
    driverHighScore,
    progAttempts,
    progHighScore,
  } = skill;
  return [
    {
      text: `--sql
        insert into vex.team (program_id, number)
        values ((select id from vex.program where code = $1), $2)
        on conflict (program_id, number) do nothing`,
      values: [programFromSku(sku), team],
    },
    ...[
      {
        type: SkillType.Driver,
        score: driverHighScore,
        attempts: driverAttempts,
      },
      {
        type: SkillType.Programming,
        score: progHighScore,
        attempts: progAttempts,
      },
    ].map(({ type, score, attempts }) => ({
      text: `--sql
        insert into vex.skill (event_id, team_id, type, rank, score, attempts)
        values (
          (select id from vex.event where code = $1),
          (
            select id from vex.team
            where program_id = (select id from vex.program where code = $2)
            and number = $3
          ),
          $4,
          $5,
          $6,
          $7
        )
        on conflict (event_id, team_id, type) do update set (
          rank,
          score,
          attempts
        ) = (
          excluded.rank,
          excluded.score,
          excluded.attempts
        )`,
      values: [
        skuFromVia(sku),
        programFromSku(sku),
        team,
        type,
        rank,
        score,
        attempts,
      ],
    })),
  ];
}

function awardFromVia(
  sku: string,
  division: number,
  name: string,
  order: number,
): QueryConfig[] {
  return [
    {
      text: `--sql
        insert into vex.division (event_id, number)
        values ((select id from vex.event where code = $1), $2)
        on conflict (event_id, number) do nothing`,
      values: [skuFromVia(sku), division],
    },
    {
      text: `--sql
        insert into vex.award (division_id, name, "order")
        values (
          (
            select id from vex.division
            where event_id = (select id from vex.event where code = $1)
            and number = $2
          ),
          $3,
          $4
        )
        on conflict (division_id, name) do update set "order" = excluded.order`,
      values: [skuFromVia(sku), division, name, order],
    },
  ];
}

function awardTeamFromVia(award: Award): QueryConfig[] {
  const { sku, division, name, teamnum: team } = award;
  return [
    {
      text: `--sql
        insert into vex.team (program_id, number)
        values ((select id from vex.program where code = $1), $2)
        on conflict (program_id, number) do nothing`,
      values: [programFromSku(sku), team],
    },
    {
      text: `--sql
        insert into vex.award_team (award_id, team_id)
        values (
          (
            select id from vex.award
            where division_id = (
              select id from vex.division
              where event_id = (select id from vex.event where code = $1)
              and number = $2
            )
            and name = $3
          ),
          (
            select id from vex.team
            where program_id = (select id from vex.program where code = $4)
            and number = $5
          )
        )
        on conflict (award_id, team_id) do nothing`,
      values: [skuFromVia(sku), division, name, programFromSku(sku), team],
    },
  ];
}

function awardIndividualFromVia(award: Award): QueryConfig {
  const { sku, division, name, recipient: individual } = award;
  return {
    text: `--sql
      insert into vex.award_individual (award_id, individual)
      values (
        (
          select id from vex.award
          where division_id = (
            select id from vex.division
            where event_id = (select id from vex.event where code = $1)
            and number = $2
          )
          and name = $3
        ),
        $4
      )
      on conflict (award_id, individual) do nothing`,
    values: [skuFromVia(sku), division, name, individual],
  };
}

function gradeFromViaTeam(ageGroup: TeamAgeGroup) {
  switch (ageGroup) {
    case TeamAgeGroup.College:
      return Grade.College;
    case TeamAgeGroup.HighSchool:
      return Grade.HighSchool;
    case TeamAgeGroup.MiddleSchool:
      return Grade.MiddleSchool;
    case TeamAgeGroup.Elementary:
      return Grade.ElementarySchool;
    default:
      return null;
  }
}

function programFromVia(program: string | undefined) {
  switch (program) {
    case "bellvrc":
      return "BellAVR";
    case "radc":
      return "ADC";
    case "tviqrc":
      return "TIQC";
    case "vaic-hs":
      return "VAIC";
    case "viqrc":
      return "VIQC";
    default:
      return program?.toUpperCase();
  }
}

function programFromSku(sku: string) {
  return programFromVia(sku.match(viaSkuRegExp)?.groups?.program);
}

function validSku(sku: string) {
  return viaSkuRegExp.test(sku);
}

function skuFromVia(sku: string) {
  return sku.toUpperCase();
}

function isIqSku(sku: string) {
  return ["tiqc", "tviqrc", "viqc", "viqrc"].some((program) =>
    sku.toLowerCase().includes(`-${program}-`),
  );
}

function coordinatesFromVia(latitude: number, longitude: number) {
  return latitude !== 0 || longitude !== 0
    ? `POINT(${longitude} ${latitude})`
    : null;
}

function dateFromVia(seconds?: number) {
  return seconds ? new Date(seconds * 1000) : null;
}

function roundFromVia(round: Round) {
  switch (round) {
    case Round.Practice:
      return MatchRound.Practice;
    case Round.Qualification:
      return MatchRound.Qualification;
    case Round.TopN:
      return MatchRound.TopN;
    case Round.RoundRobin:
      return MatchRound.RoundRobin;
    case Round.RoundOf128:
      return MatchRound.RoundOf128;
    case Round.RoundOf64:
      return MatchRound.RoundOf64;
    case Round.RoundOf32:
      return MatchRound.RoundOf32;
    case Round.RoundOf16:
      return MatchRound.RoundOf16;
    case Round.Quarterfinal:
      return MatchRound.Quarterfinal;
    case Round.Semifinal:
      return MatchRound.Semifinal;
    case Round.Final:
      return MatchRound.Final;
    default:
      return null;
  }
}
