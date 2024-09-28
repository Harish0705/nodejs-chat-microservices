import { ErrorRequestHandler } from "express";
import { StatusCodes } from "http-status-codes";

export const errorHandlerMiddleware: ErrorRequestHandler = (
  err,
  req,
  res,
  next
) => {
  const customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || "Something went wrong. Try again later.",
  };
  res.status(customError.statusCode).json({ message: customError.message });
  next();
};
