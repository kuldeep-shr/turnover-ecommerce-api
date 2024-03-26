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
exports.verifyEmailCode = exports.loginUser = exports.createUser = exports.initialRoute = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const apiResponse_1 = __importDefault(require("../../utils/apiResponse"));
const User_1 = require("../model/User");
const commonMiddlewares_1 = require("../../middleware/commonMiddlewares");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const initialRoute = async (req, res) => {
    return apiResponse_1.default.result(res, "SIMPLE E-COMMERCE API", [], http_status_codes_1.default.OK);
};
exports.initialRoute = initialRoute;
const loginUser = async (req, res) => {
    // try {
    const { email, password } = req.body;
    const user = await (0, User_1.findUser)({ email: email });
    console.log("user details for login", user);
    if (user.data.length == 0) {
        return apiResponse_1.default.error(res, http_status_codes_1.default.BAD_REQUEST, "user is not registered with us");
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
        const sendData = {
            email: email,
            token: generatingJWTToken,
        };
        return apiResponse_1.default.result(res, "user login successfully", [sendData], http_status_codes_1.default.OK);
    }
    // }
};
exports.loginUser = loginUser;
const createUser = async (req, res) => {
    try {
        const { name, email, password, address } = req.body;
        const user = await (0, User_1.findUser)({ email: email });
        if (user.data.length > 0) {
            return apiResponse_1.default.error(res, http_status_codes_1.default.BAD_REQUEST, "user already exists");
        }
        const addUserData = await (0, User_1.addUser)({
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
        const sendData = {
            name: name,
            password: password,
            email: email,
            token: generatingJWTToken,
        };
        return apiResponse_1.default.result(res, "user created successfully", [sendData], http_status_codes_1.default.CREATED);
    }
    catch (error) {
        console.log("err", error);
        return apiResponse_1.default.error(res, http_status_codes_1.default.BAD_REQUEST, "something went wrong");
    }
};
exports.createUser = createUser;
const verifyEmailCode = async (req, res) => {
    const { code } = req.body;
    const emailStaticCode = 12345678;
    if (emailStaticCode == code) {
        return apiResponse_1.default.result(res, "user email verification has been done successfully", [{ isEmailVerify: true }], http_status_codes_1.default.OK);
    }
    else {
        return apiResponse_1.default.result(res, "invalid email verification code", [{ isEmailVerify: false }], http_status_codes_1.default.BAD_REQUEST);
    }
};
exports.verifyEmailCode = verifyEmailCode;
//# sourceMappingURL=userController.js.map