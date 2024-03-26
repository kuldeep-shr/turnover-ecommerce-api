import { Request, Response, NextFunction } from "express";
import httpStatusCodes from "http-status-codes";
import { VerifyPasswordTypes, TokenAssignedTypes } from "./common_middleware";
import apiResponse from "../utils/apiResponse";
import jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization;
  if (token) {
    try {
      const decoded: string = jwt.verify(
        token.split(" ")[1],
        String(process.env.SECRET_KEY)
      ) as any;
      req.body.user = decoded;
      next();
    } catch (err) {
      apiResponse.error(res, httpStatusCodes.BAD_REQUEST, "Invalid Token");
      return null;
    }
  } else {
    apiResponse.error(res, httpStatusCodes.BAD_REQUEST, "No token provided");
    return null;
  }
};

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

export const verifyPassword = async (
  arg: VerifyPasswordTypes
): Promise<boolean> => {
  const passwordMatch = await bcrypt.compare(
    arg.inputPassword,
    arg.hashPassword
  );
  if (passwordMatch) {
    return passwordMatch;
  } else {
    return false;
  }
};

export const generateToken = (arg: TokenAssignedTypes): any => {
  const token = jwt.sign({ id: arg.id, user: arg.user }, arg.secretKey, {
    expiresIn: "24h",
  });
  return token;
};
