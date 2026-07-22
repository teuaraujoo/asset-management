import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import ApiError from "../error/app-error";

export default function accessTokenMiddleware(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) throw new ApiError("Access token não informado", 401);

    try {
        const user = jwt.verify(accessToken, process.env.JWT_SECRET!) as jwt.JwtPayload;

        req.user = {
            sub: user.sub as string,
            email: user.email as string
        };

        next();
    } catch (err) {
        next(err);
    };
};