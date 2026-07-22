import { Prisma } from "../../generated/prisma/browser";
import prisma from "../../libs/prisma";
export class AuthRepository {
    static async persistRefreshToken(token: string) {

    };

    static async findTokenByHash(token: string) {

    }

    static async revokedToken(id: number) {

    };
};