import { rejects } from "assert";
import { pool } from "../../database/connection";
import httpsCodes from "http-status-codes";
import moment from "moment";
import { hashPassword } from "../../middleware/commonMiddlewares";

const addUser = (args: any) => {
  console.log("ARGS", args);
  return new Promise(async (resolve, reject) => {
    const hasingPwd: string = await hashPassword(args.password);
    const dateTime: string = moment().format("YYYY-MM-DD HH:mm:ss");
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

const findUser = (args: any) => {
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
export { addUser, findUser };
