import prisma from "../../libs/prisma";

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
};