import AuthServices from "./auth.services";
import { Request, Response } from "express";

export default class AuthController {

    static async login(req: Request, res: Response) {

    };
    static async logout(req: Request, res: Response) {

    };

    static async refresh(req: Request, res: Response) {

    };

    static async test(_req: Request, res: Response) {
        return res.status(200).json({
            message: "Ok"
        });
    };
};