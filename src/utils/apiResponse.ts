import { Response } from "express";
import httpStatusCodes from "http-status-codes";
export default class ApiResponse {
  static result = (
    res: Response,
    message: string,
    data: object,
    status: number = 200
  ) => {
    res.status(status);
    res.json({
      message: message,
      data,
    });
  };

  static error = (
    res: Response,
    status: number = 400,
    error: string = httpStatusCodes.getStatusText(status)
  ) => {
    res.status(status).json({
      error: {
        message: error,
      },
    });
  };
}
