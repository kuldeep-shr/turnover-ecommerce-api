"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUser = exports.addUser = void 0;
const connection_1 = require("../../database/connection");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const moment_1 = __importDefault(require("moment"));
const commonMiddlewares_1 = require("../../middleware/commonMiddlewares");
const addUser = (args) => {
    console.log("ARGS", args);
    return new Promise(async (resolve, reject) => {
        const hasingPwd = await (0, commonMiddlewares_1.hashPassword)(args.password);
        const dateTime = (0, moment_1.default)().format("YYYY-MM-DD HH:mm:ss");
        console.log("dateTime", dateTime);
        const insertSql = `
      INSERT INTO users (
        name,
        email,
        password,
        created_at
      )
      VALUES(
        $1,
        $2,
        $3,
        $4
      )
      RETURNING id,name,email,created_at;
    `;
        connection_1.pool.query(insertSql, [args.name, args.email, hasingPwd, dateTime], (error, result) => {
            if (error) {
                return reject({
                    isError: true,
                    statusCode: http_status_codes_1.default.BAD_REQUEST,
                    data: [],
                    message: "something went wrong, while adding user",
                    error: error,
                });
            }
            else {
                return resolve({
                    isError: false,
                    statusCode: http_status_codes_1.default.CREATED,
                    data: result.rows,
                    message: "user successfully created",
                    error: "",
                });
            }
        });
    });
};
exports.addUser = addUser;
const findUser = (args) => {
    return new Promise(async (resolve, reject) => {
        const findByEmailQuery = `
    SELECT 
      *
    FROM users
    WHERE email LIKE '%${args.email}%'
  `;
        connection_1.pool.query(findByEmailQuery, (error, result) => {
            if (error) {
                return reject({
                    isError: true,
                    statusCode: http_status_codes_1.default.BAD_REQUEST,
                    data: [],
                    message: "something went wrong, while fetching user details",
                    error: error,
                });
            }
            else {
                return resolve({
                    isError: false,
                    statusCode: http_status_codes_1.default.OK,
                    data: result.rows,
                    message: "user details",
                    error: "",
                });
            }
        });
    });
};
exports.findUser = findUser;
//# sourceMappingURL=User.js.map