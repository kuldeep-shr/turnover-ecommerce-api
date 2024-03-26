import Joi from "joi";
import httpStatusCodes from "http-status-codes";
import { Request, Response, NextFunction } from "express";
import apiResponse from "../utils/apiResponse";

const customValidator = (value: any, helpers: any) => {
  if (value === "" || value === -1 || value === undefined) {
    return helpers.error("any.invalid");
  }
  return value;
};

const inventoryInsertSchema = Joi.array().items(
  Joi.object({
    product_id: Joi.number()
      .required()
      .error(new Error("please enter the valid product id")),
    remaining: Joi.number()
      .greater(-1)
      .error(new Error("please enter the valid remaining quantity")),
    booked: Joi.number()
      .greater(-1)
      .error(new Error("please enter the valid booked quantity")),
  })
);

export const inventoryInsertSchemaValidation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const data = req.body;
  const { error } = inventoryInsertSchema.validate(data);
  if (error) {
    apiResponse.error(res, httpStatusCodes.UNPROCESSABLE_ENTITY, error.message);
    return null;
  }
  next();
};

const inventoryUpdateSchema = Joi.array().items(
  Joi.object({
    id: Joi.number()
      .not(0)
      .required()
      .error(new Error("please enter the valid inventory id")),
    remaining: Joi.number()
      .greater(-1)
      .custom(customValidator)
      .error(new Error("please enter the valid remaining quantity")),
    booked: Joi.number()
      .greater(-1)
      .custom(customValidator)
      .error(new Error("please enter the valid booked quantity")),
  })
);

export const inventoryUpdateSchemaValidation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const data = req.body;
  const { error } = inventoryUpdateSchema.validate(data);
  if (error) {
    apiResponse.error(res, httpStatusCodes.UNPROCESSABLE_ENTITY, error.message);
    return null;
  }
  next();
};

const inventoryDeleteSchema = Joi.array()
  .min(1)
  .required()
  .error(new Error("please enter the valid inventory id"));

export const inventoryDeleteSchemaValidation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const data = req.body;
  const { error } = inventoryDeleteSchema.validate(data);
  if (error) {
    apiResponse.error(res, httpStatusCodes.UNPROCESSABLE_ENTITY, error.message);
    return null;
  }
  next();
};
