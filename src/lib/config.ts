export const databaseUrl =
  process.env.DATABASE_URL ?? "postgres://localhost:5432/vexstats?schema=vex";
export const robotEventsToken = process.env.ROBOT_EVENTS_TOKEN;
