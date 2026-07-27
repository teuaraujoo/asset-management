import { z } from "zod";

export const createProjectSchema = z.object({
    user_id: z.int().positive(),
    folder_id: z.int().positive(),
    name: z.string().min(5, "O nome do projeto deve ter pelo menos 5 caracteres.").max(120, "O nome do projeto não pode passar de 120 caracteres."),
    mini_description: z.string().max(255, "A mini descrição do projeto deve ter no máximo 255 caracteres."),
    description: z.string()
});
export type CreateProjectBody = z.infer<typeof createProjectSchema>;