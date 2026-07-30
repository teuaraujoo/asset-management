import { z } from "zod";

export const createFolderSchema = z.object({
    name: z.string().min(5, "O nome da pasta deve ter pelo menos 5 caracteres.").max(120, "O nome da pasta não pode passar de 120 caracteres."),
    description: z.string(),
    slug: z.string().max(120, "O slug deve ter no máximo 120 caracteres."),
    path: z.string()
});
export type CreateFolderBody = z.infer<typeof createFolderSchema>;
