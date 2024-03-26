import httpStatusCodes from "http-status-codes";
import { Request, Response } from "express";
import apiResponse from "../../utils/apiResponse";
import { addUser, findUser } from "../model/User";
import {
  verifyPassword,
  generateToken,
} from "../../middleware/commonMiddlewares";
import * as dotenv from "dotenv";
dotenv.config();

const initialRoute = async (req: Request, res: Response) => {
  return apiResponse.result(
    res,
    "SIMPLE E-COMMERCE API",
    [],
    httpStatusCodes.OK
  );
};
const loginUser = async (req: Request, res: Response) => {
  // try {
  const { email, password } = req.body;
  const user: any = await findUser({ email: email });
  console.log("user details for login", user);
  if (user.data.length == 0) {
    return apiResponse.error(
      res,
      httpStatusCodes.BAD_REQUEST,
      "user is not registered with us"
    );
  }
  const isPasswordMatchOrNot: boolean = await verifyPassword({
    id: user.data[0].id,
    email: email,
    inputPassword: password,
    hashPassword: user.data[0].password,
  });
  if (isPasswordMatchOrNot) {
    // password match
    const generatingJWTToken: string = await generateToken({
      id: user.data[0].id,
      user: {
        name: user.data[0].name,
        email: email,
      },
      secretKey: process.env.SECRET_KEY,
    });

    const sendData: any = {
      email: email,
      token: generatingJWTToken,
    };
    return apiResponse.result(
      res,
      "user login successfully",
      [sendData],
      httpStatusCodes.OK
    );
  }

  // }
};

const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, address } = req.body;
    const user: any = await findUser({ email: email });
    if (user.data.length > 0) {
      return apiResponse.error(
        res,
        httpStatusCodes.BAD_REQUEST,
        "user already exists"
      );
    }
    const addUserData: any = await addUser({
      name: name,
      email: email,
      password: password,
    });

    const generatingJWTToken: string = await generateToken({
      id: addUserData.data[0].id,
      user: {
        name: name,
        email: email,
      },
      secretKey: process.env.SECRET_KEY,
    });
    const sendData: any = {
      name: name,
      password: password,
      email: email,
      token: generatingJWTToken,
    };
    return apiResponse.result(
      res,
      "user created successfully",
      [sendData],
      httpStatusCodes.CREATED
    );
  } catch (error: any) {
    return apiResponse.error(
      res,
      httpStatusCodes.BAD_REQUEST,
      "something went wrong"
    );
  }
};

const verifyEmailCode = async (req: Request, res: Response) => {
  const { code } = req.body;
  const emailStaticCode = 12345678;
  if (emailStaticCode == code) {
    return apiResponse.result(
      res,
      "user email verification has been done successfully",
      [{ isEmailVerify: true }],
      httpStatusCodes.OK
    );
  } else {
    return apiResponse.result(
      res,
      "invalid email verification code",
      [{ isEmailVerify: false }],
      httpStatusCodes.BAD_REQUEST
    );
  }
};

export { initialRoute, createUser, loginUser, verifyEmailCode };
