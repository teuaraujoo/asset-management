import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import ApiError from "../error/app-error";

export default function refreshTokenMiddleware(req: Request, res: Response, next: NextFunction) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) throw new ApiError("Access token não informado", 401);

    req.refreshToken = refreshToken;
    
    next();
};