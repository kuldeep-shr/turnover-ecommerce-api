import { pool } from "../../database/connection";
import httpsCodes from "http-status-codes";
import moment from "moment";
import { hashPassword } from "../../middleware/commonMiddlewares";
import * as dotenv from "dotenv";
dotenv.config();

const addUserModel = (args: any) => {
  return new Promise(async (resolve, reject) => {
    const hasingPwd: string = await hashPassword(args.password);
    const dateTime: string = moment().format("YYYY-MM-DD HH:mm:ss");
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
    pool.query(
      insertSql,
      [args.name, args.email, hasingPwd, dateTime],
      (error, result) => {
        if (error) {
          return reject({
            isError: true,
            statusCode: httpsCodes.BAD_REQUEST,
            data: [],
            message: "something went wrong, while adding user",
            error: error,
          });
        } else {
          return resolve({
            isError: false,
            statusCode: httpsCodes.CREATED,
            data: result.rows,
            message: "user successfully created",
            error: "",
          });
        }
      }
    );
  });
};

const findUserModel = (args: any) => {
  return new Promise(async (resolve, reject) => {
    const findByEmailQuery: string = `
    SELECT 
      *
    FROM users
    WHERE email LIKE '%${args.email}%'
  `;
    pool.query(findByEmailQuery, (error, result) => {
      if (error) {
        return reject({
          isError: true,
          statusCode: httpsCodes.BAD_REQUEST,
          data: [],
          message: "something went wrong, while fetching user details",
          error: error,
        });
      } else {
        return resolve({
          isError: false,
          statusCode: httpsCodes.OK,
          data: result.rows,
          message: "user details",
          error: "",
        });
      }
    });
  });
};

const updateSelectedCategoriesModel = (args: any) => {
  return new Promise(async (resolve, reject) => {
    const { TABLE_USER_CATEGORY } = process.env;
    const categoriesIds: number[] = args.map((d: any) => d.category_id);

    //DELETE INSERT OPERATION.....
    const deleteSql = `
      DELETE FROM ${TABLE_USER_CATEGORY}
      WHERE 
        user_id=${args[0].user_id}
          AND
        category_id IN(${categoriesIds})
    `;
    pool.query(deleteSql, (error, result) => {
      if (error) {
        return reject({
          isError: true,
          statusCode: httpsCodes.BAD_REQUEST,
          data: [],
          message: "something went wrong, while deleting categories",
          error: error,
        });
      } else {
        let isReachedLastIndx = false;
        let dbUpdated: any[] = [];
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
          pool.query(
            insertSql,
            [
              args[index].category_id,
              args[index].is_selected,
              args[index].user_id,
            ],
            (error, result) => {
              if (error) {
                return reject({
                  isError: true,
                  statusCode: httpsCodes.BAD_REQUEST,
                  data: [],
                  message: "something went wrong, while inserting categories",
                  error: error,
                });
              } else {
                dbUpdated.push(result);
              }
            }
          );
        }

        if (isReachedLastIndx) {
          return resolve({
            isError: false,
            statusCode: httpsCodes.CREATED,
            data: dbUpdated,
            message: "categories inserted successfully",
            error: "",
          });
        }
      }
    });
  });
};

const categoriesListModel = (args: any) => {
  return new Promise(async (resolve, reject) => {
    const user_id = args.user_id;
    const page = args.page;
    const pageSize = args.pageSize;

    const categoriesList = (args: any) => {
      return new Promise(async (resolve, reject) => {
        const findCategoriesSql = `
          SELECT 
            id AS category_id,
            name AS category_name
          FROM ${TABLE_CATEGORY}
          ORDER BY id ASC
          LIMIT ${args.pageSize} OFFSET ${args.page}
        `;
        pool.query(findCategoriesSql, (error, result) => {
          if (error) {
            return reject({
              isError: true,
              statusCode: httpsCodes.BAD_REQUEST,
              data: [],
              message: "something went wrong, while fetching categories",
              error: error,
            });
          } else {
            const map = new Map(
              args.categoriesDataByUser.map((item: any) => [
                item.category_id,
                item,
              ])
            );
            const mergedArray = result.rows.map((item: any) => {
              const replacedItem = map.get(item.category_id);
              return replacedItem ? replacedItem : item;
            });
            return resolve({
              isError: false,
              statusCode: httpsCodes.OK,
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

    pool.query(findCategoryByUserSql, async (error, categoriesDataByUser) => {
      if (error) {
        return reject({
          isError: true,
          statusCode: httpsCodes.BAD_REQUEST,
          data: [],
          message: "something went wrong, while fetching user categories",
          error: error,
        });
      } else {
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

const categoriesCountModel = () => {
  return new Promise(async (resolve, reject) => {
    const { TABLE_CATEGORY } = process.env;
    const countSql = `
      SELECT COUNT(*) AS category_count FROM ${TABLE_CATEGORY}
    `;
    pool.query(countSql, (error, result) => {
      if (error) {
        return reject({
          isError: true,
          statusCode: httpsCodes.BAD_REQUEST,
          data: [],
          message: "something went wrong, while counting the categories",
          error: error,
        });
      } else {
        return resolve({
          isError: false,
          statusCode: httpsCodes.CREATED,
          data: result.rows[0].category_count,
          message: "categories count",
          error: "",
        });
      }
    });
  });
};

export {
  addUserModel,
  findUserModel,
  updateSelectedCategoriesModel,
  categoriesListModel,
  categoriesCountModel,
};
