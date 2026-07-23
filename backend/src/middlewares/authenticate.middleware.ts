import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import AppError from "../error/app-error";
import AuthSerivces from "../modules/auth/auth.services";

export default async function authenticateMiddleware(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    try {

        if (!accessToken && !refreshToken) throw new AppError("Tokens não informados.", 401);

        if (!accessToken) {

            if (!refreshToken) throw new AppError("Refresh Token não informado.", 401);

            const result = await AuthSerivces.refresh(refreshToken);

            req.user = {
                sub: result.user.id,
                email: result.user.email,
            };

            res.cookie("accessToken", result.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                maxAge: 1000 * 60 * 15,
                path: "/"
            })

            return next();
        };

        const payload = jwt.verify(accessToken, process.env.JWT_SECRET!) as jwt.JwtPayload;

        req.user = {
            sub: payload.sub as string,
            email: payload.email as string
        };

        return next();
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError || err instanceof jwt.JsonWebTokenError) {
            if (!refreshToken) return next(new AppError("Refresh Token não informado.", 401));
            
            try {
                const result = await AuthSerivces.refresh(refreshToken);
                
                req.user = {
                    sub: result.user.id,
                    email: result.user.email,
                };
                
                res.cookie("accessToken", result.accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                    maxAge: 1000 * 60 * 15,
                    path: "/"
                });

                return next();
            } catch {
                return next(new AppError("Sessão inválida. Faça login novamente.", 401));
            };
        };

        return next(err);
    };
};