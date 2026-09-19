import { UserServices } from "./users.service"
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

    static async get(req: Request, res: Response) {
        const result = await UserServices.getById(req.user.sub);

        return res.status(200).json({
            message: "Perfil encontrado com sucesso.",
            data: result,
        });
    };

    static async update(req: Request, res: Response) {
        const result = await UserServices.update(req.user.sub, req.body);

        req.log.info({
            event: "user.profile_updated",
            userId: req.user.sub,
        }, "User profile updated");

        return res.status(200).json({
            message: "Perfil atualizado com sucesso.",
            data: result,
        });
    };
};
