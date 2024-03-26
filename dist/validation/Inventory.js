"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventoryDeleteSchemaValidation = exports.inventoryUpdateSchemaValidation = exports.inventoryInsertSchemaValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const apiResponse_1 = __importDefault(require("../utils/apiResponse"));
const customValidator = (value, helpers) => {
    if (value === "" || value === -1 || value === undefined) {
        return helpers.error("any.invalid");
    }
    return value;
};
const inventoryInsertSchema = joi_1.default.array().items(joi_1.default.object({
    product_id: joi_1.default.number()
        .required()
        .error(new Error("please enter the valid product id")),
    remaining: joi_1.default.number()
        .greater(-1)
        .error(new Error("please enter the valid remaining quantity")),
    booked: joi_1.default.number()
        .greater(-1)
        .error(new Error("please enter the valid booked quantity")),
}));
const inventoryInsertSchemaValidation = (req, res, next) => {
    const data = req.body;
    const { error } = inventoryInsertSchema.validate(data);
    if (error) {
        apiResponse_1.default.error(res, http_status_codes_1.default.UNPROCESSABLE_ENTITY, error.message);
        return null;
    }
    next();
};
exports.inventoryInsertSchemaValidation = inventoryInsertSchemaValidation;
const inventoryUpdateSchema = joi_1.default.array().items(joi_1.default.object({
    id: joi_1.default.number()
        .not(0)
        .required()
        .error(new Error("please enter the valid inventory id")),
    remaining: joi_1.default.number()
        .greater(-1)
        .custom(customValidator)
        .error(new Error("please enter the valid remaining quantity")),
    booked: joi_1.default.number()
        .greater(-1)
        .custom(customValidator)
        .error(new Error("please enter the valid booked quantity")),
}));
const inventoryUpdateSchemaValidation = (req, res, next) => {
    const data = req.body;
    const { error } = inventoryUpdateSchema.validate(data);
    if (error) {
        apiResponse_1.default.error(res, http_status_codes_1.default.UNPROCESSABLE_ENTITY, error.message);
        return null;
    }
    next();
};
exports.inventoryUpdateSchemaValidation = inventoryUpdateSchemaValidation;
const inventoryDeleteSchema = joi_1.default.array()
    .min(1)
    .required()
    .error(new Error("please enter the valid inventory id"));
const inventoryDeleteSchemaValidation = (req, res, next) => {
    const data = req.body;
    const { error } = inventoryDeleteSchema.validate(data);
    if (error) {
        apiResponse_1.default.error(res, http_status_codes_1.default.UNPROCESSABLE_ENTITY, error.message);
        return null;
    }
    next();
};
exports.inventoryDeleteSchemaValidation = inventoryDeleteSchemaValidation;
//# sourceMappingURL=Inventory.js.map