import AuthServices from "./auth.services";
import { NextFunction, Request, Response } from "express";
import AuthenticationManage from "../../shared/auth/authentication-manager";

export default class AuthController {

    static async login(req: Request, res: Response, next: NextFunction) {
        try {

            const body = await req.body;

            const result = await AuthServices.login(body);

            AuthenticationManage.setCookies(req, res, result.accessToken, result.refreshToken)

            req.log.info({
                event: "auth.login_succeeded",
                user: req.user.sub
            }, "Login succeeded");

            return res.status(200).json({
                message: `Login realizado com sucesso. Bem vindo ${result.user.name}`,
            });
        } catch (err) {
            req.log.warn({
                event: "auth.login_failed",
                userId: req.user.sub
            }, "Login failed");

            return next(err);
        };
    };

    static async logout(req: Request, res: Response) {
        const revokedToken = await AuthServices.logout(req.refreshToken);

        AuthenticationManage.clearCookies(req, res);

        req.log.info({
            event: "auth.logout_succeeded",
            userId: req.user?.sub,
        }, "Logout succeeded");

        return res.status(200).json({ message: "Logout  realizado com sucesso.", data: revokedToken });

    };

    static async refresh(req: Request, res: Response) {

        const result = await AuthServices.refresh(req.refreshToken);

        AuthenticationManage.setAccessTokenCookie(req, res, result.accessToken);

        req.log.info({
            event: "auth.token_refreshed",
            userId: req.user.sub
        }, "Access token refreshed");

        res.status(200).json({ message: "Token renovado com sucesso." });
    };

    static async me(req: Request, res: Response, next: NextFunction) {
        try {

            const result = await AuthServices.me(req.user.email);

            res.status(200).json({ message: "infos encontradas com sucesso.", data: result });
        } catch (err) {
            return next(err)
        };
    };
};
