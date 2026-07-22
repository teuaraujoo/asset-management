import { Prisma } from "../../generated/prisma/browser";
import prisma from "../../libs/prisma";
export default class AuthRepository {
    static async persistRefreshToken(data: Prisma.refresh_tokensCreateInput) {
        return prisma.refresh_tokens.create({ data: data });
    };

    static async findTokenByHash(token: string) {
        return prisma.refresh_tokens.findFirst({
            where: {
                token_hash: token
            },
        });
    };

    static async revokedToken(id: string, now = new Date()) {
        return prisma.refresh_tokens.update({
            where: { id: id },
            data: {
                revoked: true,
                revoked_at: now
            },
        });
    };
};