import { Request, Response } from "express";
import { User } from "../database";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnauthenticatedError } from "../errors";
import { createCookie } from "../utils";

export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req?.body;

  if (!name || !email || !password)
    throw new BadRequestError("Please provide the required fields");
  // check if the email adready exists
  const isEmailAlreadyUsed = await User.findOne({ email });
  if (isEmailAlreadyUsed) {
    throw new BadRequestError(
      "Email already in use. Please provide another email"
    );
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  res
    .status(StatusCodes.OK)
    .json({
      userData: user,
      message: "Successfully registered. Please log in to continue",
    });
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req?.body;
  console.log(req.body)
  if (!email || !password)
    throw new BadRequestError("Please provide the required fields");
  const user = await User.findOne({ email });
  console.log(user)
  if (!user) throw new UnauthenticatedError("Invalid user credentials");

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) throw new UnauthenticatedError("Incorrect password");
  const tokenPayload = {
    name: user.name,
    id:user._id
  }
  await createCookie(res, tokenPayload!);
  res.status(StatusCodes.OK).json({ message: "cookie set" });
};

export const logoutUser = async (req: Request, res: Response) => {
  res.cookie("accessToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ message: "User logged out successfully!" });
};

