import { Request, Response, NextFunction } from "express";
import { UnauthenticatedError } from "../errors/index.js";
import { verifyAccessToken } from "../utils/index.js";

interface ReqUser {
  id: string;
  name: string;
  email:string;
}

export interface AuthRequest extends Request {
  user: ReqUser;
}

export const authUserMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const { accessToken } = req.signedCookies;

  try {
    const payload = verifyAccessToken(accessToken);
    req.user = {
      id: payload.id,
      name: payload.name,
      email: payload.email
    };
    console.log(req.user);
    next();
  } catch (error) {
    throw new UnauthenticatedError("Invalid credentials");
  }
};

