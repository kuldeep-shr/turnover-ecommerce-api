import httpStatusCodes from "http-status-codes";
import { Request, Response } from "express";
import apiResponse from "../../utils/apiResponse";
import {
  addUserModel,
  findUserModel,
  updateSelectedCategoriesModel,
  categoriesListModel,
  categoriesCountModel,
} from "../model/User";
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
  try {
    const { email, password } = req.body;
    const user: any = await findUserModel({ email: email });
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
    } else {
      return apiResponse.result(
        res,
        "invalid credentials",
        [],
        httpStatusCodes.BAD_REQUEST
      );
    }
  } catch (error) {
    return apiResponse.error(
      res,
      httpStatusCodes.BAD_REQUEST,
      "internal server issue"
    );
  }
};

const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, address } = req.body;
    const user: any = await findUserModel({ email: email });
    if (user.data.length > 0) {
      return apiResponse.error(
        res,
        httpStatusCodes.BAD_REQUEST,
        "user already exists"
      );
    }
    const addUserData: any = await addUserModel({
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
      "internal server issue"
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

const categoriesList = async (req: Request, res: Response) => {
  try {
    const page = (req.body.page as number) || 1;
    const pageSize = (req.body.pageSize as number) || 6;
    const user_id: number = req.body.user.id;
    const offset = (page - 1) * pageSize;
    const categoriesList: any = await categoriesListModel({
      user_id: user_id,
      page: offset,
      pageSize: pageSize,
    });

    if (categoriesList.data.length > 0) {
      return apiResponse.result(
        res,
        "categories list",
        categoriesList.data,
        httpStatusCodes.OK
      );
    } else {
      return apiResponse.result(
        res,
        "no categories list found",
        [],
        httpStatusCodes.BAD_REQUEST
      );
    }
  } catch (error) {
    return apiResponse.error(
      res,
      httpStatusCodes.BAD_REQUEST,
      "internal server issue"
    );
  }
};

const updateSelectedCategories = async (req: Request, res: Response) => {
  try {
    let apiPayload: any[] = req.body;
    apiPayload.forEach((item: any) => {
      item.user_id = req.body.user.id;
    });
    apiPayload = apiPayload.filter((item) => !item.user);
    const updatingData: any = await updateSelectedCategoriesModel(apiPayload);
    if (updatingData.statusCode == 201) {
      return apiResponse.result(
        res,
        "categories updated successfully",
        [],
        httpStatusCodes.OK
      );
    } else {
      return apiResponse.result(
        res,
        "something went wrong, while updating categories",
        [],
        httpStatusCodes.BAD_REQUEST
      );
    }
  } catch (error) {
    return apiResponse.error(
      res,
      httpStatusCodes.BAD_REQUEST,
      "internal server issue"
    );
  }
};

const pagination = async (req: Request, res: Response) => {
  try {
    const getCount: any = await categoriesCountModel();
    const returnData = {
      count: parseInt(getCount.data),
    };
    return apiResponse.result(
      res,
      "categories count",
      [returnData],
      httpStatusCodes.OK
    );
  } catch (error) {
    return apiResponse.error(
      res,
      httpStatusCodes.BAD_REQUEST,
      "internal server issue"
    );
  }
};

export {
  initialRoute,
  createUser,
  loginUser,
  verifyEmailCode,
  updateSelectedCategories,
  categoriesList,
  pagination,
};
