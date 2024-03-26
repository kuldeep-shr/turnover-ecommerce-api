import * as dotenv from "dotenv";
import postgres from "postgres";
import { Pool } from "pg";
dotenv.config();

let { PGSTRING } = process.env;
export const pool = new Pool({
  connectionString: PGSTRING,
  ssl: {
    rejectUnauthorized: false,
  },
});
