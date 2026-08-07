import AuthServices from "./auth.services";
import { Request, Response } from "express";
import AuthenticationManage from "../../shared/auth/authentication-manager";

export default class AuthController {

    static async login(req: Request, res: Response) {
        const body = await req.body;

        const result = await AuthServices.login(body);

        AuthenticationManage.setCookies(req, res, result.accessToken, result.refreshToken)

        return res.status(200).json({
            message: `Login realizado com sucesso. Bem vindo ${result.user.name}`,
        });
    };

    static async logout(req: Request, res: Response) {
        const revokedToken = await AuthServices.logout(req.refreshToken);

        AuthenticationManage.clearCookies(req, res);

        return res.status(200).json({ message: "Logout  realizado com sucesso.", data: revokedToken });

    };

    static async refresh(req: Request, res: Response) {

        const result = await AuthServices.refresh(req.refreshToken);

        AuthenticationManage.setAccessTokenCookie(req, res, result.accessToken);

        res.status(200).json({ message: "Token renovado com sucesso." });
    };

    static async me(req: Request, res: Response) {
        const result = await AuthServices.me(req.user.email);

        res.status(200).json({ message: "infos encontradas com sucesso.", data: result });
    };
};