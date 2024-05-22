import { Response, Request, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/user_model";

export interface AuthRequest extends Request {
  user: string;
}
//   request: AuthRequest,
//   response: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { authorization } = request.headers;
//     if (!authorization) {
//       return response
//         .status(401)
//         .json({ error: "Authorization failed Please login" });
//     }

//     const { _id } = jwt.verify(authorization, "token") as JwtPayload;
//     const existingUser = await User.findOne(_id);
//     if (existingUser) {
//       request.user = existingUser.id;
//     }
//     next();
//   } catch (error) {
//     return response
//       .status(500)
//       .send({ message: "Oops! Something went wrong", error });
//   }
// };

export const authenticationMiddleware = async (
  request: AuthRequest,
  response: Response,
  next: NextFunction
) => {
  try {
    const { authorization } = request.headers;
    if (!authorization) {
      return response
        .status(401)
        .json({ error: "Authorization failed. Please login." });
    }

    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.USER_TOKEN) as JwtPayload;
    const existingUser = await User.findById(decoded.id);
    if (!existingUser) {
      return response.status(401).json({ error: "User not found." });
    }

    request.user = existingUser._id;
    next();
  } catch (error) {
    return response
      .status(500)
      .send({ message: "Oops! Something went wrong", error });
  }
};
