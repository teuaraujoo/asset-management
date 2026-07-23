import AuthServices from "./auth.services";
import { Request, Response } from "express";
import AppError from "../../error/app-error";

export default class AuthController {

    private static readonly FIFTEEN_MINUTES_IN_MILLISECONDS = 1000 * 60 * 15;
    private static readonly SEVEN_DAYS_IN_MILLISECONDS = 7 * 24 * 60 * 60 * 1000;

    static async login(req: Request, res: Response) {
        const body = await req.body;

        const result = await AuthServices.login(body);

        res.cookie("accessToken", result.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: AuthController.FIFTEEN_MINUTES_IN_MILLISECONDS,
            path: "/"
        });

        res.cookie("refreshToken", result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: AuthController.SEVEN_DAYS_IN_MILLISECONDS,
            path: "/"
        });

        return res.status(200).json({
            message: `Login realizado com sucesso. Bem vindo ${result.user.name}`,
        });
    };

    static async logout(req: Request, res: Response) {
        const revokedToken = await AuthServices.logout(req.refreshToken);

        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            path: "/"
        });

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            path: "/"
        });

        return res.status(200).json({ message: "Logout  realizado com sucesso.", data: revokedToken });

    };

    static async refresh(req: Request, res: Response) {

        const result = await AuthServices.refresh(req.refreshToken);

        res.cookie("accessToken", result.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: AuthController.FIFTEEN_MINUTES_IN_MILLISECONDS,
            path: "/"
        });

        res.status(200).json({ message: "Token renovado com sucesso." });
    };

    static async test(_req: Request, res: Response) {
        return res.status(200).json({
            message: "Ok"
        });
    };
};