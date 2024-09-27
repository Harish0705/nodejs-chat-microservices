import { Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config/config";

const jwtSecret = config.JWT_SECRET as string;

interface ReqUser {
  id: string;
  name: string;
  email: string;
}

export const createCookie = async (res: Response, user: ReqUser) => {
  const { id, name, email } = user;
  const accessToken = jwt.sign({ id, name, email }, jwtSecret, {
    expiresIn: config.JWT_LIFETIME,
  });

  const accessTokenExpiryTime = 1000 * 60 * 60 * 24;
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    expires: new Date(Date.now() + accessTokenExpiryTime),
    secure: process.env.NODE_ENV === "production",
    signed: true,
  });
};

export const verifyAccessToken = (authToken: string) =>
  jwt.verify(authToken, jwtSecret);
