import { Response } from "express";
import jwt from "jsonwebtoken";
import { IUser } from "../database";
import config from "../config/config";

const jwtSecret = config.JWT_SECRET as string;

interface ReqUser {
  name: string,
  id:unknown, 
}

export const createCookie = async (res: Response, user: ReqUser) => {
  const { name, id } = user;
  const accessToken = jwt.sign({ name, id }, jwtSecret, {
    expiresIn: config.JWT_LIFETIME,
  })

  const accessTokenExpiryTime = 1000 * 60 * 60 * 24;
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    expires: new Date(Date.now() + accessTokenExpiryTime),
    secure: process.env.NODE_ENV === "production",
    signed: true,
  });
};

export const verifyAccessToken = (authToken:string) =>
  jwt.verify(authToken, jwtSecret);
