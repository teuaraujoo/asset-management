import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ApiError from "../../error/app-error";
import { CreateUserBody, createUserSchema } from "./users.schemas";
import UserRepository from "./users.repositories";

export class UserServices {

    static async create(body: CreateUserBody) {
        try {

            const data = createUserSchema.parse(body);
            const user = await UserRepository.getUserByEmail(data.email);

            if (user) throw new ApiError("Usuário já cadastrado com esse email.", 409);

            const hashPassword = await bcrypt.hash(data.password, 12);

            const parsedData = {
                name: data.name,
                email: data.email,
                password_hash: hashPassword
            };

            return await UserRepository.createUser(parsedData);

        } catch (err) {
            throw err;
        };
    };
}