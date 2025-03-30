import pg from "pg";
import { databaseUrl } from "./lib/config.js";

export const pool = new pg.Pool({ connectionString: databaseUrl });
