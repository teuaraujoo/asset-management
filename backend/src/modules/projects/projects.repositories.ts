import { Prisma } from "../../generated/prisma/browser";
import prisma from "../../libs/prisma";

export default class ProjectRepository {
    static async get() {
        return prisma.projects.findMany({
            orderBy: {
                created_at: "asc"
            }
        });
    };

    static async getById(id: string) {
        return prisma.projects.findUnique({
            where: {
                id: id
            }
        })
    };

    static create() {

    };

    static update() {

    };

    static delete() {

    };
};