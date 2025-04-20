import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import response from "../utils/response";
import { JWT_SECRET } from "../utils/env";

interface IReqUser extends Request {
  user?: JwtPayload;
}

export const authMiddleware = (req: IReqUser, res: Response, next: NextFunction) => {
  const authorization = req.headers?.authorization;

  if (!authorization) {
    return response.unauthorized(res);
  }

  const [prefix, token] = authorization.split(" ");

  if (!(prefix === "Bearer" && token)) {
    return response.unauthorized(res);
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET as string);

    if (typeof decoded === "object" && "userId" in decoded && "username" in decoded) {
      req.user = decoded;
      next();
    } else {
      response.error(res, null, "Invalid token payload", 401);
    }
  } catch (error) {
    response.error(res, error, "Invalid token", 401);
  }
};
