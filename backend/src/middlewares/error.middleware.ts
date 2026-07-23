import { NextFunction, Request, Response } from "express";
import AppError from "../error/app-error";
import jwt from "jsonwebtoken";

export default function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (err instanceof AppError) {

        if (err.statusCode === 401) {

            res.clearCookie("accessToken", {
                path: "/"
            });

            res.clearCookie("refreshToken", {
                path: "/"
            });

            return res.status(err.statusCode).json({
                message: err.message
            });

        };

        return res.status(err.statusCode).json({
            message: err.message
        });
    };

    if (err instanceof jwt.TokenExpiredError) {
        return res.status(401).json({
            message: "Access Token expirado."
        });
    };

    if (err instanceof jwt.JsonWebTokenError) {
        res.clearCookie("accessToken", {
            path: "/"
        });

        return res.status(401).json({
            message: "Access Token inválido."
        });
    };

    console.error(err);

    return res.status(500).json({
        message: "Error interno do servidor."
    });
};