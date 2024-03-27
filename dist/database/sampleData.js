"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = require("./connection");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const faker_1 = require("@faker-js/faker");
const generateFakeProductData = async () => {
    const products = [];
    for (let i = 0; i < 60; i++) {
        const product = {
            name: faker_1.faker.commerce.department(),
            description: faker_1.faker.lorem.sentence(),
        };
        products.push(product);
    }
    return products;
};
async function createTables() {
    const tableInit = await connection_1.pool.connect();
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
        const products = await generateFakeProductData();
        const values = products
            .map((product, index) => `($${index * 2 + 1}, $${index * 2 + 2})`)
            .join(",");
        const queryText = `INSERT INTO ${TABLE_CATEGORY} (name, description) VALUES ${values}`;
        // Execute table creation queries
        await tableInit.query(createTableQuery1);
        await tableInit.query(createTableQuery2);
        await tableInit.query(createTableQuery3);
        await tableInit.query(queryText, products.flatMap((product) => [product.name, product.description]));
        await tableInit.query("COMMIT");
        console.log("Tables created successfully (if not exist).");
    }
    catch (err) {
        await tableInit.query("ROLLBACK");
        console.error("Error creating tables:", err);
    }
    finally {
        tableInit.release();
    }
}
createTables();
//# sourceMappingURL=sampleData.js.map