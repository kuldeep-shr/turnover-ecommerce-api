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
  try {
    return res.render("signup", { errorMessage: "" });
  } catch (error) {
    console.log("error initial route", error);
  }
};

const loginPage = async (req: Request, res: Response) => {
  try {
    return res.render("login", { errorMessage: "" });
  } catch (error) {
    console.log("error login route", error);
  }
};

const categoryPage = async (req: Request, res: Response) => {
  const token = decodeURIComponent(req.query.token as string);
  if (["", undefined, null, 0, "undefined"].includes(token)) {
    return res.redirect("/api/v1");
  } else {
    const categoriesListData: any = await categoriesListModel({
      user_id: 1,
      page: 0,
      pageSize: 6,
    });
    return res.render("category", {
      errorMessage: "",
      categories: categoriesListData.data,
      currentPage: 1,
      totalPages: 6,
      token: token,
    });
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user: any = await findUserModel({ email: email });
    if (user.data.length == 0) {
      return res.render("login", {
        errorMessage: "user is not registered with us",
      });
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

      const categoriesList: any = await categoriesListModel({
        user_id: user.data[0].id,
        page: 0,
        pageSize: 10,
      });
      return res.render("category", {
        errorMessage: "",
        email: email,
        categories: categoriesList.data,
        currentPage: 1,
        totalPages: 100,
        token: generatingJWTToken,
      });
    } else {
      return res.render("login", {
        errorMessage: "invalid credentials,please check your password or email",
        email: "",
        token: "",
      });
    }
  } catch (error) {
    console.log("error", error);
    return apiResponse.error(
      res,
      httpStatusCodes.BAD_REQUEST,
      "internal server issue"
    );
  }
};

const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const user: any = await findUserModel({ email: email });
    if (user.data.length > 0) {
      // return apiResponse.error(
      //   res,
      //   httpStatusCodes.BAD_REQUEST,
      //   "user already exists"
      // );
      const errorMessage = "user already exists";
      return res.render("signup", { errorMessage });
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
    const obscureEmail = (email: string) => {
      // Split the email address into two parts: local part and domain part
      const [localPart, domainPart] = email.split("@");

      // Take the first two characters of the local part
      const firstTwoCharacters = localPart.slice(0, 2);

      // Replace all characters in the local part except the first two characters with asterisks
      const obscuredLocalPart =
        firstTwoCharacters + "*".repeat(localPart.length - 2);

      // Return the partially obscured email address
      return `${obscuredLocalPart}@${domainPart}`;
    };

    const obscuredEmail = obscureEmail(email);

    res.render("verification", {
      token: generatingJWTToken,
      email: obscuredEmail,
      errorMessage: "",
    });
    // return apiResponse.result(
    //   res,
    //   "user created successfully",
    //   [sendData],
    //   httpStatusCodes.CREATED
    // );
  } catch (error: any) {
    console.log("error create-user", error);
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
    const errorMessage = "";
    // return res.render("main", {
    //   errorMessage: errorMessage,
    //   categories: [
    //     {
    //       category_id: 1,
    //       catgeory_name: "abc",
    //       is_selected: false,
    //     },
    //     {
    //       category_id: 2,
    //       catgeory_name: "efd",
    //       is_selected: false,
    //     },
    //     {
    //       category_id: 3,
    //       is_selected: true,
    //       catgeory_name: "ggg",
    //       user_id: 1,
    //       user_name: "Dummy",
    //     },
    //     {
    //       category_id: 4,
    //       is_selected: true,
    //       catgeory_name: "hhh",
    //       user_id: 1,
    //       user_name: "Dummy",
    //     },
    //   ],
    //   token: token,
    //   pageSize: 100,
    //   email: "",
    // });

    return apiResponse.result(res, "correct opt", [], httpStatusCodes.OK);
  } else {
    const errorMessage = "invalid email verification code";
    // return res.render("verification", {
    //   errorMessage: errorMessage,
    //   token: token,
    //   email: req.body.user.email,
    // });
    return apiResponse.result(
      res,
      "invalid email verification code",
      [],
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
      return res.render("category", {
        errorMessage: "",
        categories: categoriesList,
        token: "",
      });

      // return apiResponse.result(
      //   res,
      //   "no categories list found",
      //   [],
      //   httpStatusCodes.BAD_REQUEST
      // );
    }
  } catch (error) {
    console.log("error categories list", error);
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
    console.log("error update list", error);
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
    console.log("error pagination list", error);
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
  loginPage,
  categoryPage,
};
