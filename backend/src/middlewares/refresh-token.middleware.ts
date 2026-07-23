import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import AppError from "../error/app-error";

export default function refreshTokenMiddleware(req: Request, res: Response, next: NextFunction) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) throw new AppError("Refresh token não informado", 401);

    req.refreshToken = refreshToken;
    
    next();
};