"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoriesListSchemaValidation = exports.updateCategoriesSchemaValidation = exports.verifyEmailSchemaValidation = exports.loginSchemaValidation = exports.registerSchemaValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const apiResponse_1 = __importDefault(require("../utils/apiResponse"));
const registerSchema = joi_1.default.object({
    name: joi_1.default.string().required().error(new Error("please enter the name")),
    email: joi_1.default.string()
        .email()
        .required()
        .error(new Error("please enter the valid email")),
    password: joi_1.default.string()
        .min(5)
        .required()
        .error(new Error("please enter the valid password of minimum 5 words")),
});
const registerSchemaValidation = (req, res, next) => {
    const data = req.body;
    const { error } = registerSchema.validate(data);
    if (error) {
        apiResponse_1.default.error(res, http_status_codes_1.default.UNPROCESSABLE_ENTITY, error.message);
        return null;
    }
    next();
};
exports.registerSchemaValidation = registerSchemaValidation;
const loginSchema = joi_1.default.object({
    email: joi_1.default.string()
        .email()
        .required()
        .error(new Error("please enter the valid email")),
    password: joi_1.default.string()
        .required()
        .error(new Error("please enter the valid password of minimum 5 words")),
});
const loginSchemaValidation = (req, res, next) => {
    const data = req.body;
    const { error } = loginSchema.validate(data);
    if (error) {
        apiResponse_1.default.error(res, http_status_codes_1.default.UNPROCESSABLE_ENTITY, error.message);
        return null;
    }
    next();
};
exports.loginSchemaValidation = loginSchemaValidation;
const verifyEmailSchema = joi_1.default.object({
    code: joi_1.default.number()
        .min(11111111)
        .max(99999999)
        .required()
        .error(new Error("please enter the valid email verification  of eight digits")),
});
const verifyEmailSchemaValidation = (req, res, next) => {
    const data = req.body;
    const { error } = verifyEmailSchema.validate(data);
    if (error) {
        apiResponse_1.default.error(res, http_status_codes_1.default.UNPROCESSABLE_ENTITY, error.message);
        return null;
    }
    next();
};
exports.verifyEmailSchemaValidation = verifyEmailSchemaValidation;
const updateCategoriesSchema = joi_1.default.array()
    .items(joi_1.default.object({
    category_id: joi_1.default.number()
        .greater(0)
        .required()
        .error(new Error("please enter the valid category id")),
    is_selected: joi_1.default.boolean()
        .required()
        .error(new Error("please check the marked/unmarked category or check the parameter is_selected")),
}))
    .min(1)
    .required()
    .error(new Error("please atleast select the single category"));
const updateCategoriesSchemaValidation = (req, res, next) => {
    const data = req.body;
    const { error } = updateCategoriesSchema.validate(data);
    if (error) {
        apiResponse_1.default.error(res, http_status_codes_1.default.UNPROCESSABLE_ENTITY, error.message);
        return null;
    }
    next();
};
exports.updateCategoriesSchemaValidation = updateCategoriesSchemaValidation;
const categoriesListSchema = joi_1.default.object({
    page: joi_1.default.number()
        .greater(-1)
        .required()
        .error(new Error("please enter the valid page")),
    pageSize: joi_1.default.number()
        .greater(0)
        .required()
        .error(new Error("please enter the valid page size")),
});
const categoriesListSchemaValidation = (req, res, next) => {
    const data = req.body;
    const { error } = categoriesListSchema.validate(data);
    if (error) {
        apiResponse_1.default.error(res, http_status_codes_1.default.UNPROCESSABLE_ENTITY, error.message);
        return null;
    }
    next();
};
exports.categoriesListSchemaValidation = categoriesListSchemaValidation;
//# sourceMappingURL=User.js.map