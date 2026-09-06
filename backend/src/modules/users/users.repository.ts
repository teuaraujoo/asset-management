import { Prisma } from "../../generated/prisma/client";
import prisma from "../../libs/prisma";
import type { UpdateUserData } from "./users.types";

export default class UserRepository {

    static async getUserById(id: string) {
        return prisma.users.findUnique({
            where: {
                id: id
            }
        })
    }

    static async getUserByEmail(email: string) {
        return prisma.users.findUnique({
            where: {
                email
            }
        });
    };

    static async createUser(user: Prisma.usersCreateInput) {
        return prisma.users.create({ data: user });
    };

    static async getUserByEmailExcludingId(email: string, userId: string) {
        return prisma.users.findFirst({
            where: {
                email,
                id: { not: userId },
            },
        });
    };

    static async updateUser(id: string, data: UpdateUserData) {
        return prisma.users.update({
            where: { id },
            data,
        });
    };
};
