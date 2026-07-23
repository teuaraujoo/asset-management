import { UserServices } from "./users.services"
import { Request, Response } from "express";

export class UserController {
    static async create(req: Request, res: Response) {

        const body = await req.body;

        const result = await UserServices.create(body);

        res.status(200).json({
            message: "Usuário criado com sucesso",
            user: result
        });

    };

    static async test(_req: Request, res: Response) {
        return res.status(200).json({
            message: "Ok"
        });
    };
};