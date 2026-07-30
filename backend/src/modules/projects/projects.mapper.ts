import { Prisma } from "../../generated/prisma/browser";

export type ProjectWithRelations = Prisma.projectsGetPayload<{
    include: {
        folders: true,
        users: {
            select: {
                name: true,
                email: true,
                is_active: true
            }
        }
    };
}>;

export class ProjectMapper {
    static toResponseGet(project: ProjectWithRelations) {
        return {
            id: project.id,
            folder_id: project.folder_id,
            name: project.name,
            mini_description: project.mini_description,
            description: project.description,
            slug: project.folders.slug,
            path: project.folders.path,
            user: {
                id: project.user_id,
                name: project.users.name,
                email: project.users.email,
            }
        };
    };
};