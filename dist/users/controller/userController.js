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
exports.categoryPage = exports.loginPage = exports.pagination = exports.categoriesList = exports.updateSelectedCategories = exports.verifyEmailCode = exports.loginUser = exports.createUser = exports.signupPage = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const apiResponse_1 = __importDefault(require("../../utils/apiResponse"));
const User_1 = require("../model/User");
const commonMiddlewares_1 = require("../../middleware/commonMiddlewares");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const signupPage = async (req, res) => {
    try {
        return res.render("signup", { errorMessage: "" });
    }
    catch (error) {
        console.log("error initial route", error);
    }
};
exports.signupPage = signupPage;
const loginPage = async (req, res) => {
    try {
        return res.render("login", { errorMessage: "" });
    }
    catch (error) {
        console.log("error login route", error);
    }
};
exports.loginPage = loginPage;
const categoryPage = async (req, res) => {
    const token = decodeURIComponent(req.query.token);
    if (["", undefined, null, 0, "undefined"].includes(token)) {
        return res.redirect("/api/v1");
    }
    else {
        const categoriesListData = await (0, User_1.categoriesListModel)({
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
exports.categoryPage = categoryPage;
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await (0, User_1.findUserModel)({ email: email });
        if (user.data.length == 0) {
            return res.render("login", {
                errorMessage: "user is not registered with us",
            });
        }
        const isPasswordMatchOrNot = await (0, commonMiddlewares_1.verifyPassword)({
            id: user.data[0].id,
            email: email,
            inputPassword: password,
            hashPassword: user.data[0].password,
        });
        if (isPasswordMatchOrNot) {
            // password match
            const generatingJWTToken = await (0, commonMiddlewares_1.generateToken)({
                id: user.data[0].id,
                user: {
                    name: user.data[0].name,
                    email: email,
                },
                secretKey: process.env.SECRET_KEY,
            });
            const categoriesList = await (0, User_1.categoriesListModel)({
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
        }
        else {
            return res.render("login", {
                errorMessage: "invalid credentials,please check your password or email",
                email: "",
                token: "",
            });
        }
    }
    catch (error) {
        console.log("error", error);
        return apiResponse_1.default.error(res, http_status_codes_1.default.BAD_REQUEST, "internal server issue");
    }
};
exports.loginUser = loginUser;
const createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await (0, User_1.findUserModel)({ email: email });
        if (user.data.length > 0) {
            const errorMessage = "user already exists";
            return res.render("signup", { errorMessage });
        }
        const addUserData = await (0, User_1.addUserModel)({
            name: name,
            email: email,
            password: password,
        });
        const generatingJWTToken = await (0, commonMiddlewares_1.generateToken)({
            id: addUserData.data[0].id,
            user: {
                name: name,
                email: email,
            },
            secretKey: process.env.SECRET_KEY,
        });
        const obscureEmail = (email) => {
            // Split the email address into two parts: local part and domain part
            const [localPart, domainPart] = email.split("@");
            const firstTwoCharacters = localPart.slice(0, 2);
            const obscuredLocalPart = firstTwoCharacters + "*".repeat(localPart.length - 2);
            return `${obscuredLocalPart}@${domainPart}`;
        };
        const obscuredEmail = obscureEmail(email);
        res.render("verification", {
            token: generatingJWTToken,
            email: obscuredEmail,
            errorMessage: "",
        });
    }
    catch (error) {
        return apiResponse_1.default.error(res, http_status_codes_1.default.BAD_REQUEST, "internal server issue");
    }
};
exports.createUser = createUser;
const verifyEmailCode = async (req, res) => {
    const { code } = req.body;
    const emailStaticCode = 12345678;
    if (emailStaticCode == code) {
        return apiResponse_1.default.result(res, "correct opt", [], http_status_codes_1.default.OK);
    }
    else {
        return apiResponse_1.default.result(res, "invalid email verification code", [], http_status_codes_1.default.BAD_REQUEST);
    }
};
exports.verifyEmailCode = verifyEmailCode;
const categoriesList = async (req, res) => {
    try {
        const page = req.body.page || 1;
        const pageSize = req.body.pageSize || 6;
        const user_id = req.body.user.id;
        const offset = (page - 1) * pageSize;
        const categoriesList = await (0, User_1.categoriesListModel)({
            user_id: user_id,
            page: offset,
            pageSize: pageSize,
        });
        if (categoriesList.data.length > 0) {
            return apiResponse_1.default.result(res, "categories list", categoriesList.data, http_status_codes_1.default.OK);
        }
        else {
            return res.render("category", {
                errorMessage: "",
                categories: categoriesList,
                token: "",
            });
        }
    }
    catch (error) {
        return apiResponse_1.default.error(res, http_status_codes_1.default.BAD_REQUEST, "internal server issue");
    }
};
exports.categoriesList = categoriesList;
const updateSelectedCategories = async (req, res) => {
    try {
        let apiPayload = req.body;
        apiPayload.forEach((item) => {
            item.user_id = req.body.user.id;
        });
        apiPayload = apiPayload.filter((item) => !item.user);
        const updatingData = await (0, User_1.updateSelectedCategoriesModel)(apiPayload);
        if (updatingData.statusCode == 201) {
            return apiResponse_1.default.result(res, "categories updated successfully", [], http_status_codes_1.default.OK);
        }
        else {
            return apiResponse_1.default.result(res, "something went wrong, while updating categories", [], http_status_codes_1.default.BAD_REQUEST);
        }
    }
    catch (error) {
        return apiResponse_1.default.error(res, http_status_codes_1.default.BAD_REQUEST, "internal server issue");
    }
};
exports.updateSelectedCategories = updateSelectedCategories;
const pagination = async (req, res) => {
    try {
        const getCount = await (0, User_1.categoriesCountModel)();
        const returnData = {
            count: parseInt(getCount.data),
        };
        return apiResponse_1.default.result(res, "categories count", [returnData], http_status_codes_1.default.OK);
    }
    catch (error) {
        return apiResponse_1.default.error(res, http_status_codes_1.default.BAD_REQUEST, "internal server issue");
    }
};
exports.pagination = pagination;
//# sourceMappingURL=userController.js.map