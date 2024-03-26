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
async function createTables() {
    const tableInit = await connection_1.pool.connect();
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