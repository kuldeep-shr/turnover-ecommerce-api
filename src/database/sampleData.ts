import { pool } from "./connection";
import * as dotenv from "dotenv";
dotenv.config();

async function createTables() {
  const tableInit = await pool.connect();
  try {
    await tableInit.query("BEGIN");

    // Define your table creation queries here
    const createTableQuery1 = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    // const createTableQuery2 = `
    //   CREATE TABLE IF NOT EXISTS product (
    //     id SERIAL PRIMARY KEY,
    //     email VARCHAR(255)
    //   )
    // `;

    // Execute table creation queries
    await tableInit.query(createTableQuery1);
    // await client.query(createTableQuery2);

    await tableInit.query("COMMIT");
    console.log("Tables created successfully (if not exist).");
  } catch (err) {
    await tableInit.query("ROLLBACK");
    console.error("Error creating tables:", err);
  } finally {
    tableInit.release();
  }
}

createTables();
