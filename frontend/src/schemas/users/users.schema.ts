import { z } from "zod";

export const updateNameSchema = z.object({
    name: z.string().trim().min(4, "O nome deve ter pelo menos 4 caracteres."),
});

export const updateEmailSchema = z.object({
    email: z.email("Informe um email válido."),
});
