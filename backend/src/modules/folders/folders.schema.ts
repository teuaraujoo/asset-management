import { z } from "zod";

export const createFolderSchema = z.object({
    name: z.string().min(5, "O nome da pasta deve ter pelo menos 5 caracteres.").max(120, "O nome da pasta não pode passar de 120 caracteres."),
    description: z.string(),
});
export const updateFolderSchema = createFolderSchema.partial();

export type CreateFolderBody = z.infer<typeof createFolderSchema>;
export type UpdateFolderBody = z.infer<typeof updateFolderSchema>;
