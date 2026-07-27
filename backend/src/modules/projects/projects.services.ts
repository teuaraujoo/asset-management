import AppError from "../../error/app-error";
import { CreateProjectBody, createProjectSchema } from "./project.schema";
import ProjectRepository from "./projects.repositories";

export default class ProjectService {
    static createProject(body: CreateProjectBody) { 
        const data = createProjectSchema.parse(body);
        const folder = FolderRepository.get(data.folder_id);

        if (folder) throw new AppError("Já existe um projeto vinculado a essa pasta.", 409);

    };

    static updateProject() { 
        
    };

    static deleteProject() { 

    };

    private generateProjectSlug() { 

    };
};