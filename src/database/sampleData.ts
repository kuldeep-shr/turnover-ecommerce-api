import { pool } from "./connection";
import * as dotenv from "dotenv";
dotenv.config();
import { faker } from "@faker-js/faker";

const generateFakeProductData = async () => {
  interface Product {
    name: string;
    description: string;
  }
  const products: Product[] = [];
  for (let i = 0; i < 60; i++) {
    const product: Product = {
      name: faker.commerce.department(),
      description: faker.lorem.sentence(),
    };
    products.push(product);
  }
  return products;
};

async function createTables() {
  const tableInit = await pool.connect();
  try {
    const { TABLE_USER, TABLE_CATEGORY, TABLE_USER_CATEGORY } = process.env;
    await tableInit.query("BEGIN");

    // Define your table creation queries here
    const createTableQuery1 = `
      CREATE TABLE IF NOT EXISTS ${TABLE_USER} (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    const createTableQuery2 = `
      CREATE TABLE IF NOT EXISTS ${TABLE_CATEGORY} (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        description TEXT
      )
    `;

    const createTableQuery3 = `
      CREATE TABLE IF NOT EXISTS ${TABLE_USER_CATEGORY} (
        user_id INT,
        category_id INT,
        is_selected BOOLEAN DEFAULT FALSE
      )
    `;

    const products: any = await generateFakeProductData();

    const values = products
      .map(
        (product: any, index: any) => `($${index * 2 + 1}, $${index * 2 + 2})`
      )
      .join(",");

    const queryText = `INSERT INTO ${TABLE_CATEGORY} (name, description) VALUES ${values}`;

    // Execute table creation queries
    await tableInit.query(createTableQuery1);
    await tableInit.query(createTableQuery2);
    await tableInit.query(createTableQuery3);

    await tableInit.query(
      queryText,
      products.flatMap((product: any) => [product.name, product.description])
    );

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
