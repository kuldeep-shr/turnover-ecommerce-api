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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoriesCountModel = exports.categoriesListModel = exports.updateSelectedCategoriesModel = exports.findUserModel = exports.addUserModel = void 0;
const connection_1 = require("../../database/connection");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const moment_1 = __importDefault(require("moment"));
const commonMiddlewares_1 = require("../../middleware/commonMiddlewares");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const addUserModel = (args) => {
    return new Promise(async (resolve, reject) => {
        const hasingPwd = await (0, commonMiddlewares_1.hashPassword)(args.password);
        const dateTime = (0, moment_1.default)().format("YYYY-MM-DD HH:mm:ss");
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
exports.addUserModel = addUserModel;
const findUserModel = (args) => {
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
exports.findUserModel = findUserModel;
const updateSelectedCategoriesModel = (args) => {
    return new Promise(async (resolve, reject) => {
        const { TABLE_USER_CATEGORY } = process.env;
        const categoriesIds = args.map((d) => d.category_id);
        //DELETE INSERT OPERATION.....
        const deleteSql = `
      DELETE FROM ${TABLE_USER_CATEGORY}
      WHERE 
        user_id=${args[0].user_id}
          AND
        category_id IN(${categoriesIds})
    `;
        connection_1.pool.query(deleteSql, (error, result) => {
            if (error) {
                return reject({
                    isError: true,
                    statusCode: http_status_codes_1.default.BAD_REQUEST,
                    data: [],
                    message: "something went wrong, while deleting categories",
                    error: error,
                });
            }
            else {
                let isReachedLastIndx = false;
                let dbUpdated = [];
                for (let index = 0; index < args.length; index++) {
                    args.length - 1 == index
                        ? (isReachedLastIndx = true)
                        : isReachedLastIndx;
                    const insertSql = `
            INSERT INTO ${TABLE_USER_CATEGORY} (category_id,is_selected,user_id)
            VALUES(
              $1,
              $2,
              $3
            )
          `;
                    connection_1.pool.query(insertSql, [
                        args[index].category_id,
                        args[index].is_selected,
                        args[index].user_id,
                    ], (error, result) => {
                        if (error) {
                            return reject({
                                isError: true,
                                statusCode: http_status_codes_1.default.BAD_REQUEST,
                                data: [],
                                message: "something went wrong, while inserting categories",
                                error: error,
                            });
                        }
                        else {
                            dbUpdated.push(result);
                        }
                    });
                }
                if (isReachedLastIndx) {
                    return resolve({
                        isError: false,
                        statusCode: http_status_codes_1.default.CREATED,
                        data: dbUpdated,
                        message: "categories inserted successfully",
                        error: "",
                    });
                }
            }
        });
    });
};
exports.updateSelectedCategoriesModel = updateSelectedCategoriesModel;
const categoriesListModel = (args) => {
    return new Promise(async (resolve, reject) => {
        const user_id = args.user_id;
        const page = args.page;
        const pageSize = args.pageSize;
        const categoriesList = (args) => {
            return new Promise(async (resolve, reject) => {
                const findCategoriesSql = `
          SELECT 
            id AS category_id,
            name AS category_name
          FROM ${TABLE_CATEGORY}
          ORDER BY id ASC
          LIMIT ${args.pageSize} OFFSET ${args.page}
        `;
                connection_1.pool.query(findCategoriesSql, (error, result) => {
                    if (error) {
                        return reject({
                            isError: true,
                            statusCode: http_status_codes_1.default.BAD_REQUEST,
                            data: [],
                            message: "something went wrong, while fetching categories",
                            error: error,
                        });
                    }
                    else {
                        const map = new Map(args.categoriesDataByUser.map((item) => [
                            item.category_id,
                            item,
                        ]));
                        const mergedArray = result.rows.map((item) => {
                            const replacedItem = map.get(item.category_id);
                            return replacedItem ? replacedItem : item;
                        });
                        return resolve({
                            isError: false,
                            statusCode: http_status_codes_1.default.OK,
                            data: mergedArray,
                            message: "categories list",
                            error: "",
                        });
                    }
                });
            });
        };
        const { TABLE_USER_CATEGORY, TABLE_CATEGORY, TABLE_USER } = process.env;
        const findCategoryByUserSql = `
      SELECT
        cat.id AS category_id,
        cat.name AS category_name,
        user_cat.is_selected,
        u.id AS user_id,
        u.name AS user_name
      FROM ${TABLE_USER} AS u
      LEFT JOIN ${TABLE_USER_CATEGORY} AS user_cat
        ON u.id=user_cat.user_id
      LEFT JOIN ${TABLE_CATEGORY} AS cat
        ON user_cat.category_id=cat.id
      WHERE
        u.id=${user_id}
    `;
        connection_1.pool.query(findCategoryByUserSql, async (error, categoriesDataByUser) => {
            if (error) {
                return reject({
                    isError: true,
                    statusCode: http_status_codes_1.default.BAD_REQUEST,
                    data: [],
                    message: "something went wrong, while fetching user categories",
                    error: error,
                });
            }
            else {
                const mergedList = await categoriesList({
                    categoriesDataByUser: categoriesDataByUser.rows,
                    page: page,
                    pageSize: pageSize,
                });
                resolve(mergedList);
            }
        });
    });
};
exports.categoriesListModel = categoriesListModel;
const categoriesCountModel = () => {
    return new Promise(async (resolve, reject) => {
        const { TABLE_CATEGORY } = process.env;
        const countSql = `
      SELECT COUNT(*) AS category_count FROM ${TABLE_CATEGORY}
    `;
        connection_1.pool.query(countSql, (error, result) => {
            if (error) {
                return reject({
                    isError: true,
                    statusCode: http_status_codes_1.default.BAD_REQUEST,
                    data: [],
                    message: "something went wrong, while counting the categories",
                    error: error,
                });
            }
            else {
                return resolve({
                    isError: false,
                    statusCode: http_status_codes_1.default.CREATED,
                    data: result.rows[0].category_count,
                    message: "categories count",
                    error: "",
                });
            }
        });
    });
};
exports.categoriesCountModel = categoriesCountModel;
//# sourceMappingURL=User.js.map