
import { z } from "zod";

export const createProjectSchema = z.object({
    name: z
        .string()
        .min(5, "O nome deve ter pelo menos 5 caracteres")
        .max(120, "O nome deve ter no máximo 120 caracteres"),
    mini_description: z
        .string()
        .min(3, "A mini descrição deve ter pelo menos 3 caracteres")
        .max(255, "A mini descrição deve ter no máximo 255 caracteres"),
    description: z
        .string()
        .min(10, "A descrição deve ter pelo menos 10 caracteres"),
});

export type CreateProjectFormData = z.infer<typeof createProjectSchema>;
