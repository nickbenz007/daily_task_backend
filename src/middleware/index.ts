import {Response, Request, NextFunction} from "express";
import jwt, {JwtPayload} from "jsonwebtoken";
import User from "../models/user_model";


export interface AuthRequest extends Request {
    user: string
}

export const authenticationMiddleware = async (request: AuthRequest, response: Response, next: NextFunction) => {
    try {
    const {authorization} = request.headers;
        if(!authorization){
        return response.status(401).json({error: 'Authorization failed Please login again'})
        }

        const {_id} = jwt.verify(authorization, 'token') as JwtPayload;
        const existingUser = await User.findOne(_id)
        if(existingUser){
            request.user = existingUser.id
        }
        next()
    }catch (error){
        return response.status(500).send({message: 'Oops! Something went wrong', error})
    }
}