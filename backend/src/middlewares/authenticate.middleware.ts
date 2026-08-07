import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import AppError from "../error/app-error";
// import AuthSerivces from "../modules/auth/auth.services";
import AuthenticationManage from "../shared/auth/authentication-manager";

export default async function authenticateMiddleware(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) throw new AppError("JWT_SECRET não configurado no .env", 500);

    try {

        if (!accessToken && !refreshToken) throw new AppError("Tokens não informados.", 401);

        if (!accessToken) {

            await AuthenticationManage.authenticateWithRefresh(req, res, refreshToken);

            return next();
        };

        const payload = jwt.verify(accessToken, jwtSecret, {
            algorithms: ["HS256"],
            issuer: "ams-api",
            audience: "ams-frontend"
        }) as jwt.JwtPayload;

        req.user = {
            sub: payload.sub as string,
            email: payload.email as string
        };

        return next();
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError || err instanceof jwt.JsonWebTokenError) {
            if (!refreshToken) return next(new AppError("Refresh Token não informado.", 401));

            try {

                await AuthenticationManage.authenticateWithRefresh(req, res, refreshToken);

                return next();
            } catch {
                return next(new AppError("Sessão inválida. Faça login novamente.", 401));
            };
        };

        return next(err);
    };
};