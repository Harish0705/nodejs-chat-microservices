import jwt from "jsonwebtoken";
import config from "../config/config";

interface TokenPayload {
    id: string;
    name: string;
    email:string;
    iat: number;
    exp: number;
}

const jwtSecret = config.JWT_SECRET as string;

export const verifyAccessToken = (authToken:string) =>
    jwt.verify(authToken, jwtSecret) as TokenPayload;