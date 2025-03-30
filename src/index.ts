import {
  updateAllEvents,
  updateDataForCurrentEvents,
  updateDataForFutureEvents,
  updateDataForPastEvents,
} from "./vex-via.js";

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;

await scheduleUpdateAllEvents();
await scheduleUpdateCurrentEvents();
await scheduleUpdateRecentEvents();
await scheduleUpdateUpcomingEvents();

async function scheduleUpdateAllEvents() {
  await updateAllEvents();
  setTimeout(scheduleUpdateAllEvents, 1 * WEEK);
}

async function scheduleUpdateCurrentEvents() {
  await updateDataForCurrentEvents();
  setTimeout(scheduleUpdateCurrentEvents, 5 * MINUTE);
}

async function scheduleUpdateRecentEvents() {
  await updateDataForPastEvents(1 * WEEK);
  setTimeout(scheduleUpdateRecentEvents, 1 * DAY);
}

async function scheduleUpdateUpcomingEvents() {
  await updateDataForFutureEvents(1 * WEEK);
  setTimeout(scheduleUpdateUpcomingEvents, 1 * DAY);
}
