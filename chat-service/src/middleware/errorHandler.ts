import { ErrorRequestHandler } from "express";
import { StatusCodes } from "http-status-codes";

export const errorHandlerMiddleware: ErrorRequestHandler = (
  err,
  req,
  res,
  next
) => {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || "Something went wrong. Try again later.",
  };
  if (err.name === "ValidationError") {
    customError.message = Object.values(err.errors)
      .map((item:any) => item.message)
      .join(",");
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  if (err.name === "CastError") {
    console.log(err);
    customError.message = `No data found for: ${err.value} Please check the id`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }
  // If the user uses existing email to sign in
  if (err?.code === 11000 && Object.keys(err.keyValue)[0] === "email") {
    customError.message =
      "Email is registered to another account. Please try again with another email";
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }
  res.status(customError.statusCode).json({ message: customError.message });
  next();
};
