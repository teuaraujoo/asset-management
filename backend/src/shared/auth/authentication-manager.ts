import { Request, Response } from "express";
import AuthServices from "../../modules/auth/auth.services";

export default class AuthenticationManage {

    private static readonly FIFTEEN_MINUTES_IN_MILLISECONDS = 1000 * 60 * 15;
    private static readonly SEVEN_DAYS_IN_MILLISECONDS = 7 * 24 * 60 * 60 * 1000;

    static async authenticateWithRefresh(req: Request, res: Response, refreshToken: string) {
        const result = await AuthServices.refresh(refreshToken);

        req.user = {
            sub: result.user.id,
            email: result.user.email,
        };

        res.cookie("accessToken", result.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: AuthenticationManage.FIFTEEN_MINUTES_IN_MILLISECONDS,
            path: "/"
        });

    };

    static setCookies(_req: Request, res: Response, accessToken: string, refreshToken: string) {
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: AuthenticationManage.FIFTEEN_MINUTES_IN_MILLISECONDS,
            path: "/"
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: AuthenticationManage.SEVEN_DAYS_IN_MILLISECONDS,
            path: "/"
        });
    };

    static setAccessTokenCookie(_req: Request, res: Response, accessToken: string) {
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: AuthenticationManage.FIFTEEN_MINUTES_IN_MILLISECONDS,
            path: "/"
        });
    };

    static clearCookies(_req: Request, res: Response) {
        res.clearCookie("accessToken", {
            path: "/"
        });

        res.clearCookie("refreshToken", {
            path: "/"
        });
    };

    static clearAccessTokenCookie(_req: Request, res: Response) {
        res.clearCookie("accessToken", {
            path: "/"
        })
    };
};